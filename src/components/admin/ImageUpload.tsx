import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  name?: string; // hidden input name for FormData forms
  folder?: string;
  maxSizeKB?: number;
  label?: string;
}

const ImageUpload = ({ value = "", onChange, name, folder = "admin", maxSizeKB = 1024, label }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(value);
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "ত্রুটি", description: "শুধু ছবি ফাইল আপলোড করা যাবে", variant: "destructive" });
      return;
    }
    if (file.size > maxSizeKB * 1024) {
      toast({ title: "ত্রুটি", description: `ছবির সাইজ ${maxSizeKB}KB এর কম হতে হবে`, variant: "destructive" });
      return;
    }
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const path = `${user?.id}/${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    setUploading(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    setUrl(data.publicUrl);
    onChange(data.publicUrl);
    toast({ title: "সফল", description: "ছবি আপলোড হয়েছে" });
  };

  const clear = () => {
    setUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      {name && <input type="hidden" name={name} value={url} />}
      <div className="flex items-center gap-2">
        <label className="inline-flex">
          <Button asChild type="button" variant="outline" size="sm" disabled={uploading}>
            <span>
              {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              {uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড"}
            </span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {url && (
          <Button type="button" variant="ghost" size="sm" onClick={clear} className="text-destructive">
            <X className="h-4 w-4 mr-1" /> সরান
          </Button>
        )}
      </div>
      <Input
        value={url}
        onChange={(e) => { setUrl(e.target.value); onChange(e.target.value); }}
        placeholder="বা ছবির URL পেস্ট করুন"
        className="border-2 border-primary"
      />
      {url && (
        <img src={url} alt="preview" className="mt-1 max-h-32 rounded border border-border object-cover" />
      )}
    </div>
  );
};

export default ImageUpload;
