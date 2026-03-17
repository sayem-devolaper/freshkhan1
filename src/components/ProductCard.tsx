import { Link } from "react-router-dom";
import { Star, ShoppingCart, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} কার্টে যোগ হয়েছে`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {product.originalPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                ছাড়
              </span>
            )}
            {product.organic && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                <BadgeCheck className="h-3 w-3" /> অর্গানিক
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{product.vendor}</p>
            <h3 className="mt-1 font-semibold leading-tight text-card-foreground line-clamp-2">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-organic-gold text-organic-gold" />
              <span className="text-xs font-medium text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-foreground">৳{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">/ {product.unit}</span>
              </div>
              <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
