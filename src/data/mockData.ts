export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  vendor: string;
  vendorId: string;
  rating: number;
  reviewCount: number;
  organic: boolean;
  inStock: boolean;
  description: string;
  unit: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  location: string;
  certified: boolean;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export const categories: Category[] = [
  { id: "1", name: "Organic Vegetables", icon: "🥬", productCount: 124 },
  { id: "2", name: "Organic Fruits", icon: "🍎", productCount: 89 },
  { id: "3", name: "Organic Dairy", icon: "🥛", productCount: 45 },
  { id: "4", name: "Organic Spices", icon: "🌿", productCount: 67 },
  { id: "5", name: "Organic Grains", icon: "🌾", productCount: 38 },
  { id: "6", name: "Organic Cosmetics", icon: "🧴", productCount: 52 },
];

export const products: Product[] = [
  {
    id: "1", name: "Fresh Organic Tomatoes", price: 4.99, originalPrice: 6.99,
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=400&fit=crop",
    category: "Organic Vegetables", vendor: "Green Valley Farm", vendorId: "v1",
    rating: 4.8, reviewCount: 124, organic: true, inStock: true,
    description: "Vine-ripened organic tomatoes grown without pesticides.", unit: "per kg"
  },
  {
    id: "2", name: "Organic Avocados", price: 3.49,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    category: "Organic Fruits", vendor: "Sunrise Organics", vendorId: "v2",
    rating: 4.6, reviewCount: 89, organic: true, inStock: true,
    description: "Creamy Hass avocados from certified organic farms.", unit: "each"
  },
  {
    id: "3", name: "Raw Organic Honey", price: 12.99,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Organic Spices", vendor: "Bee Natural Co", vendorId: "v3",
    rating: 4.9, reviewCount: 201, organic: true, inStock: true,
    description: "Pure unprocessed honey from free-range organic apiaries.", unit: "500g"
  },
  {
    id: "4", name: "Organic Fresh Milk", price: 5.99,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    category: "Organic Dairy", vendor: "Happy Cow Dairy", vendorId: "v4",
    rating: 4.7, reviewCount: 156, organic: true, inStock: true,
    description: "Farm-fresh whole milk from grass-fed organic cows.", unit: "1 liter"
  },
  {
    id: "5", name: "Organic Spinach Bundle", price: 2.99, originalPrice: 3.99,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    category: "Organic Vegetables", vendor: "Green Valley Farm", vendorId: "v1",
    rating: 4.5, reviewCount: 78, organic: true, inStock: true,
    description: "Freshly harvested organic baby spinach leaves.", unit: "per bunch"
  },
  {
    id: "6", name: "Organic Blueberries", price: 6.49,
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    category: "Organic Fruits", vendor: "Berry Bliss Farm", vendorId: "v5",
    rating: 4.8, reviewCount: 112, organic: true, inStock: true,
    description: "Plump organic blueberries bursting with antioxidants.", unit: "250g"
  },
  {
    id: "7", name: "Organic Turmeric Powder", price: 8.99,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
    category: "Organic Spices", vendor: "Spice Root Co", vendorId: "v6",
    rating: 4.7, reviewCount: 94, organic: true, inStock: true,
    description: "Premium ground turmeric from organic farms.", unit: "200g"
  },
  {
    id: "8", name: "Organic Brown Rice", price: 7.49,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    category: "Organic Grains", vendor: "Golden Fields", vendorId: "v7",
    rating: 4.6, reviewCount: 67, organic: true, inStock: true,
    description: "Wholesome organic brown rice, rich in fiber.", unit: "1 kg"
  },
];

export const vendors: Vendor[] = [
  {
    id: "v1", name: "Green Valley Farm", description: "Family-owned organic farm specializing in fresh vegetables since 1998.",
    rating: 4.8, reviewCount: 342, productCount: 28, location: "Vermont, USA",
    certified: true, image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=300&fit=crop"
  },
  {
    id: "v2", name: "Sunrise Organics", description: "Premium organic fruits grown with sustainable practices.",
    rating: 4.7, reviewCount: 218, productCount: 19, location: "California, USA",
    certified: true, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=300&fit=crop"
  },
  {
    id: "v3", name: "Bee Natural Co", description: "Artisanal honey and bee products from organic apiaries.",
    rating: 4.9, reviewCount: 156, productCount: 8, location: "Oregon, USA",
    certified: true, image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop"
  },
  {
    id: "v4", name: "Happy Cow Dairy", description: "Organic dairy from free-range, grass-fed cows.",
    rating: 4.7, reviewCount: 189, productCount: 12, location: "Wisconsin, USA",
    certified: true, image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&h=300&fit=crop"
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1", name: "Sarah Mitchell", rating: 5, avatar: "SM",
    text: "Fresh Khan has completely changed how I shop for groceries. The quality of organic produce is unmatched, and I love supporting local farmers directly!"
  },
  {
    id: "2", name: "David Chen", rating: 5, avatar: "DC",
    text: "As a vendor, Fresh Khan has given me direct access to health-conscious customers. My sales have grown 300% since joining the platform."
  },
  {
    id: "3", name: "Emily Rodriguez", rating: 4, avatar: "ER",
    text: "The variety of organic products available is incredible. From farm-fresh vegetables to artisanal honey — everything arrives fresh and well-packaged."
  },
];
