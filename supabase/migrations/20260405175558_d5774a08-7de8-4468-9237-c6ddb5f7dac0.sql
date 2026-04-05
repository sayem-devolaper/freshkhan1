
CREATE OR REPLACE FUNCTION public.place_order(
  p_vendor_id uuid,
  p_items jsonb,
  p_payment_method text,
  p_shipping_address_id uuid DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
BEGIN
  v_customer_id := auth.uid();
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate payment method
  IF p_payment_method NOT IN ('cash_on_delivery', 'bkash', 'nagad') THEN
    RAISE EXCEPTION 'Invalid payment method: %', p_payment_method;
  END IF;

  -- Get vendor commission rate
  SELECT commission_rate INTO v_commission_rate
  FROM vendors WHERE id = p_vendor_id AND is_approved = true AND is_suspended = false;
  
  IF v_commission_rate IS NULL THEN
    RAISE EXCEPTION 'Vendor not found or not active';
  END IF;

  -- Validate items and calculate subtotal from live prices
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

  -- Calculate totals
  v_total := v_subtotal + v_shipping;
  v_commission := ROUND(v_total * v_commission_rate / 100, 2);
  v_vendor_earnings := v_total - v_commission;

  -- Create order
  INSERT INTO orders (
    customer_id, vendor_id, subtotal, shipping_cost, total,
    commission_rate, commission_amount, vendor_earnings,
    payment_method, payment_status, status, notes,
    shipping_address_id, order_number
  ) VALUES (
    v_customer_id, p_vendor_id, v_subtotal, v_shipping, v_total,
    v_commission_rate, v_commission, v_vendor_earnings,
    p_payment_method,
    CASE WHEN p_payment_method = 'cash_on_delivery' THEN 'pending' ELSE 'awaiting_confirmation' END,
    'pending', p_notes,
    p_shipping_address_id, 'FK-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')
  ) RETURNING id INTO v_order_id;

  -- Create order items and deduct stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, price INTO v_product
    FROM products WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES (
      v_order_id, v_product.id, v_product.name,
      (v_item->>'quantity')::int, v_product.price,
      v_product.price * (v_item->>'quantity')::int
    );

    -- Deduct stock
    UPDATE products SET stock = stock - (v_item->>'quantity')::int
    WHERE id = v_product.id;
  END LOOP;

  RETURN v_order_id;
END;
$$;
