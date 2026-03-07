
CREATE OR REPLACE FUNCTION public.calculate_commission(order_total NUMERIC, rate NUMERIC DEFAULT 10.00)
RETURNS TABLE(commission NUMERIC, vendor_earnings NUMERIC)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  commission := ROUND(order_total * rate / 100, 2);
  vendor_earnings := order_total - commission;
  RETURN NEXT;
END;
$$;
