import { Link } from "react-router-dom";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import type { Vendor } from "@/types/database";
import { motion } from "framer-motion";

const VendorCard = ({ vendor }: { vendor: Vendor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/vendors/${vendor.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
          <div className="relative h-32 overflow-hidden bg-secondary">
            <img
              src={vendor.image}
              alt={vendor.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            {vendor.certified && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                <BadgeCheck className="h-3 w-3" /> সার্টিফাইড
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg font-semibold text-card-foreground">{vendor.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {vendor.location}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-organic-gold text-organic-gold" />
                <span className="text-sm font-medium">{vendor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{vendor.productCount} পণ্য</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VendorCard;
