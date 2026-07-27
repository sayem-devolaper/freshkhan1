import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Facebook, Instagram, Youtube, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { usePublishedPages } from "@/hooks/use-page";

const Footer = () => {
  const navigate = useNavigate();
  const siteName = useSiteSetting("site_name", "ফ্রেশ খান");
  const logoUrl = useSiteSetting("logo_url", "");
  const tagline = useSiteSetting(
    "footer_tagline",
    "কৃষক ও সার্টিফাইড বিক্রেতাদের কাছ থেকে সরাসরি অর্গানিক পণ্যের জন্য আপনার বিশ্বস্ত মার্কেটপ্লেস।"
  );
  const facebook = useSiteSetting("social_facebook", "");
  const instagram = useSiteSetting("social_instagram", "");
  const youtube = useSiteSetting("social_youtube", "");
  const contactEmail = useSiteSetting("contact_email", "");
  const contactAddress = useSiteSetting("contact_address", "");

  const { data: cmsPages = [] } = usePublishedPages();

  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <span className="font-display text-xl font-bold">{siteName}</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">{tagline}</p>
            {(facebook || instagram || youtube) && (
              <div className="flex items-center gap-2 pt-1">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                    className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">দ্রুত লিঙ্ক</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/products" className="text-sm opacity-70 transition-opacity hover:opacity-100">পণ্যসমূহ</Link>
              <Link to="/vendors" className="text-sm opacity-70 transition-opacity hover:opacity-100">বিক্রেতা</Link>
              {cmsPages.map((p) => (
                <Link key={p.id} to={`/page/${p.slug}`} className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  {p.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Vendors */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">বিক্রেতাদের জন্য</h4>
            <nav className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => navigate("/vendor/register")}
              >
                বিক্রেতা হন
              </Button>
              <Link to="/vendor/login" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                বিক্রেতা লগইন
              </Link>
            </nav>
            {(contactEmail || contactAddress) && (
              <div className="space-y-1.5 pt-2 text-sm opacity-70">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:opacity-100">
                    <Mail className="h-4 w-4" /> {contactEmail}
                  </a>
                )}
                {contactAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" /> <span>{contactAddress}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">আপডেট থাকুন</h4>
            <p className="text-sm opacity-70">সাপ্তাহিক অর্গানিক অফার ও কৃষি গল্প পান।</p>
            <div className="flex gap-2">
              <Input placeholder="আপনার ইমেইল" className="border-border/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button variant="accent" size="icon" aria-label="Subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-sm opacity-50">
          © ২০২৬ {siteName}। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;
