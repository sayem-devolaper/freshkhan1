import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/types/database";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories-public"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      // Get product count per category
      const { data: products } = await supabase
        .from("products")
        .select("category_id")
        .eq("is_approved", true);

      const countMap: Record<string, number> = {};
      (products || []).forEach((p) => {
        if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
      });

      return (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon || "📦",
        slug: c.slug,
        productCount: countMap[c.id] || 0,
      }));
    },
  });
};
