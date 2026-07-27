import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  sort_order: number;
}

export const usePage = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["cms-page", slug],
    queryFn: async (): Promise<CmsPage | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error || !data) return null;
      return data as CmsPage;
    },
    enabled: !!slug,
  });
};

export const usePublishedPages = () => {
  return useQuery({
    queryKey: ["cms-pages-published"],
    queryFn: async (): Promise<CmsPage[]> => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, title, content, meta_title, meta_description, is_published, sort_order")
        .eq("is_published", true)
        .order("sort_order");
      if (error) return [];
      return (data || []) as CmsPage[];
    },
  });
};
