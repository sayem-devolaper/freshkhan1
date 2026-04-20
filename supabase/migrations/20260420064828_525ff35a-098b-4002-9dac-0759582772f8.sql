-- 1. Add transaction fields to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS sender_phone text;

-- 2. Seed bKash & Nagad number settings (empty defaults)
INSERT INTO public.site_settings (key, value) VALUES
  ('bkash_number', ''),
  ('nagad_number', ''),
  ('payment_instructions', 'উপরের নম্বরে Send Money করে TrxID এবং আপনার নম্বর নিচে দিন।')
ON CONFLICT (key) DO NOTHING;

-- 3. Update place_order to accept trx fields and auto-process COD
CREATE OR REPLACE FUNCTION public.place_order(
  p_vendor_id uuid,
  p_items jsonb,
  p_payment_method text,
  p_shipping_address_id uuid DEFAULT NULL::uuid,
  p_notes text DEFAULT NULL::text,
  p_transaction_id text DEFAULT NULL::text,
  p_sender_phone text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_order_id uuid;
  v_subtotal numeric := 0;
  v_shipping numeric := 0;
  v_total numeric;
  v_commission_rate numeric;
  v_commission numeric;
  v_vendor_earnings numeric;
  v_item jsonb;
  v_product record;
  v_customer_id uuid;
  v_status order_status;
  v_payment_status text;
BEGIN
  v_customer_id := auth.uid();
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_payment_method NOT IN ('cash_on_delivery', 'bkash', 'nagad') THEN
    RAISE EXCEPTION 'Invalid payment method: %', p_payment_method;
  END IF;

  IF p_payment_method IN ('bkash', 'nagad') AND (p_transaction_id IS NULL OR length(trim(p_transaction_id)) = 0) THEN
    RAISE EXCEPTION 'Transaction ID required for mobile banking payment';
  END IF;

  SELECT commission_rate INTO v_commission_rate
  FROM vendors WHERE id = p_vendor_id AND is_approved = true AND is_suspended = false;
  IF v_commission_rate IS NULL THEN
    RAISE EXCEPTION 'Vendor not found or not active';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, price, stock INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid
      AND vendor_id = p_vendor_id
      AND is_approved = true;
    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Product not found or not available: %', v_item->>'product_id';
    END IF;
    IF v_product.stock < (v_item->>'quantity')::int THEN
      RAISE EXCEPTION 'Insufficient stock for product: %', v_product.name;
    END IF;
    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::int);
  END LOOP;

  v_total := v_subtotal + v_shipping;
  v_commission := ROUND(v_total * v_commission_rate / 100, 2);
  v_vendor_earnings := v_total - v_commission;

  -- COD: auto-confirm to processing. bKash/Nagad: keep pending until admin confirms payment.
  IF p_payment_method = 'cash_on_delivery' THEN
    v_status := 'processing'::order_status;
    v_payment_status := 'pending';
  ELSE
    v_status := 'pending'::order_status;
    v_payment_status := 'awaiting_confirmation';
  END IF;

  INSERT INTO orders (
    customer_id, vendor_id, subtotal, shipping_cost, total,
    commission_rate, commission_amount, vendor_earnings,
    payment_method, payment_status, status, notes,
    shipping_address_id, order_number, transaction_id, sender_phone
  ) VALUES (
    v_customer_id, p_vendor_id, v_subtotal, v_shipping, v_total,
    v_commission_rate, v_commission, v_vendor_earnings,
    p_payment_method, v_payment_status, v_status, p_notes,
    p_shipping_address_id,
    'FK-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
    p_transaction_id, p_sender_phone
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, price INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES (v_order_id, v_product.id, v_product.name,
      (v_item->>'quantity')::int, v_product.price,
      v_product.price * (v_item->>'quantity')::int);
    UPDATE products SET stock = stock - (v_item->>'quantity')::int WHERE id = v_product.id;
  END LOOP;

  RETURN v_order_id;
END;
$function$;

-- 4. Admin-only confirm payment RPC
CREATE OR REPLACE FUNCTION public.confirm_order_payment(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can confirm payments';
  END IF;
  UPDATE orders
  SET payment_status = 'paid',
      status = CASE WHEN status = 'pending'::order_status THEN 'processing'::order_status ELSE status END,
      updated_at = now()
  WHERE id = p_order_id;
END;
$function$;