import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSetting(key: string, fallback = "") {
  const [value, setValue] = useState<string>(fallback);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (active && data?.value) setValue(data.value);
    })();
    return () => { active = false; };
  }, [key]);

  return value;
}
