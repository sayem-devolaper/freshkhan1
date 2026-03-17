// Shared types derived from database schema for frontend use

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images?: string[] | null;
  category: string;
  categoryId?: string | null;
  vendor: string;
  vendorId: string;
  rating: number;
  reviewCount: number;
  organic: boolean;
  inStock: boolean;
  description: string;
  unit: string;
  stock: number;
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
  slug: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

// Keep testimonials as static data since there's no DB table for them
export const testimonials: Testimonial[] = [
  {
    id: "1", name: "ফাতেমা আক্তার", rating: 5, avatar: "ফআ",
    text: "ফ্রেশ খান আমার মুদি কেনার ধরন সম্পূর্ণ বদলে দিয়েছে। অর্গানিক পণ্যের মান অতুলনীয়, এবং সরাসরি কৃষকদের সাহায্য করতে পেরে ভালো লাগে!"
  },
  {
    id: "2", name: "রহিম উদ্দিন", rating: 5, avatar: "রউ",
    text: "একজন বিক্রেতা হিসেবে, ফ্রেশ খান আমাকে স্বাস্থ্য-সচেতন ক্রেতাদের কাছে সরাসরি পৌঁছানোর সুযোগ দিয়েছে। প্ল্যাটফর্মে যোগ দেওয়ার পর আমার বিক্রি ৩০০% বেড়েছে।"
  },
  {
    id: "3", name: "নাজমা বেগম", rating: 4, avatar: "নব",
    text: "এখানে অর্গানিক পণ্যের বৈচিত্র্য অবিশ্বাস্য। খামার-তাজা শাকসবজি থেকে কারিগরি মধু — সবকিছু তাজা এবং সুন্দরভাবে প্যাক করা আসে।"
  },
];
