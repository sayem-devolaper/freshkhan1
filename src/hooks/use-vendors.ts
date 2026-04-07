import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vendor } from "@/types/database";

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors-public"],
    queryFn: async (): Promise<Vendor[]> => {
      const { data, error } = await supabase
        .from("vendors_public")
        .select("*")
        .eq("is_approved", true)
        .eq("is_suspended", false)
        .order("rating", { ascending: false });

      if (error) throw error;

      // Get product counts per vendor
      const vendorIds = (data || []).map((v) => v.id);
      const { data: products } = await supabase
        .from("products")
        .select("vendor_id")
        .eq("is_approved", true)
        .in("vendor_id", vendorIds);

      const countMap: Record<string, number> = {};
      (products || []).forEach((p) => {
        countMap[p.vendor_id] = (countMap[p.vendor_id] || 0) + 1;
      });

      return (data || []).map((v) => ({
        id: v.id,
        name: v.store_name,
        description: v.description || "",
        rating: Number(v.rating) || 0,
        reviewCount: v.review_count || 0,
        productCount: countMap[v.id] || 0,
        location: v.address || "বাংলাদেশ",
        certified: !!v.organic_certification,
        image: v.banner_url || v.logo_url || "/placeholder.svg",
      }));
    },
  });
};

export const useVendor = (id: string | undefined) => {
  return useQuery({
    queryKey: ["vendor-public", id],
    queryFn: async (): Promise<Vendor | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("vendors_public")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return null;

      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", id)
        .eq("is_approved", true);

      return {
        id: data.id,
        name: data.store_name,
        description: data.description || "",
        rating: Number(data.rating) || 0,
        reviewCount: data.review_count || 0,
        productCount: count || 0,
        location: data.address || "বাংলাদেশ",
        certified: !!data.organic_certification,
        image: data.banner_url || data.logo_url || "/placeholder.svg",
      };
    },
    enabled: !!id,
  });
};
