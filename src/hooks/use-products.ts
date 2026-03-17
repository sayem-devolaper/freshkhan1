import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/database";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, vendors(store_name, address), categories(name)")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg",
        images: p.images,
        category: (p.categories as any)?.name || "",
        categoryId: p.category_id,
        vendor: (p.vendors as any)?.store_name || "",
        vendorId: p.vendor_id,
        rating: Number(p.rating) || 0,
        reviewCount: p.review_count || 0,
        organic: p.is_organic,
        inStock: p.stock > 0,
        description: p.description || "",
        unit: p.unit,
        stock: p.stock,
      }));
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*, vendors(store_name, address), categories(name)")
        .eq("id", id)
        .single();

      if (error) return null;

      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : null,
        image: data.images && data.images.length > 0 ? data.images[0] : "/placeholder.svg",
        images: data.images,
        category: (data.categories as any)?.name || "",
        categoryId: data.category_id,
        vendor: (data.vendors as any)?.store_name || "",
        vendorId: data.vendor_id,
        rating: Number(data.rating) || 0,
        reviewCount: data.review_count || 0,
        organic: data.is_organic,
        inStock: data.stock > 0,
        description: data.description || "",
        unit: data.unit,
        stock: data.stock,
      };
    },
    enabled: !!id,
  });
};
