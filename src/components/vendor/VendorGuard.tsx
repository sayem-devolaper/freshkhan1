import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VendorGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/vendor/login");
        return;
      }

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id, is_approved, is_suspended")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!vendor || !vendor.is_approved || vendor.is_suspended) {
        navigate("/vendor/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading && !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default VendorGuard;
