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
  { id: "1", name: "অর্গানিক শাকসবজি", icon: "🥬", productCount: 124 },
  { id: "2", name: "অর্গানিক ফলমূল", icon: "🍎", productCount: 89 },
  { id: "3", name: "অর্গানিক দুগ্ধ", icon: "🥛", productCount: 45 },
  { id: "4", name: "অর্গানিক মশলা", icon: "🌿", productCount: 67 },
  { id: "5", name: "অর্গানিক শস্য", icon: "🌾", productCount: 38 },
  { id: "6", name: "অর্গানিক প্রসাধনী", icon: "🧴", productCount: 52 },
];

export const products: Product[] = [
  {
    id: "1", name: "তাজা অর্গানিক টমেটো", price: 120, originalPrice: 150,
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=400&fit=crop",
    category: "অর্গানিক শাকসবজি", vendor: "সবুজ উপত্যকা খামার", vendorId: "v1",
    rating: 4.8, reviewCount: 124, organic: true, inStock: true,
    description: "কীটনাশকমুক্ত লতায় পাকা অর্গানিক টমেটো।", unit: "প্রতি কেজি"
  },
  {
    id: "2", name: "অর্গানিক আভোকাডো", price: 350,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    category: "অর্গানিক ফলমূল", vendor: "সূর্যোদয় অর্গানিকস", vendorId: "v2",
    rating: 4.6, reviewCount: 89, organic: true, inStock: true,
    description: "সার্টিফাইড অর্গানিক খামার থেকে ক্রিমি হাস আভোকাডো।", unit: "প্রতিটি"
  },
  {
    id: "3", name: "খাঁটি অর্গানিক মধু", price: 450,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "অর্গানিক মশলা", vendor: "মৌ প্রকৃতি কোং", vendorId: "v3",
    rating: 4.9, reviewCount: 201, organic: true, inStock: true,
    description: "মুক্ত পরিবেশে পালিত মৌমাছির খাঁটি অপ্রক্রিয়াজাত মধু।", unit: "৫০০ গ্রাম"
  },
  {
    id: "4", name: "অর্গানিক তাজা দুধ", price: 80,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    category: "অর্গানিক দুগ্ধ", vendor: "সুখী গাভী ডেইরি", vendorId: "v4",
    rating: 4.7, reviewCount: 156, organic: true, inStock: true,
    description: "ঘাস খাওয়া অর্গানিক গাভীর খামার-তাজা দুধ।", unit: "১ লিটার"
  },
  {
    id: "5", name: "অর্গানিক পালং শাক", price: 40, originalPrice: 55,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    category: "অর্গানিক শাকসবজি", vendor: "সবুজ উপত্যকা খামার", vendorId: "v1",
    rating: 4.5, reviewCount: 78, organic: true, inStock: true,
    description: "সদ্য তোলা অর্গানিক পালং শাকের পাতা।", unit: "প্রতি আঁটি"
  },
  {
    id: "6", name: "অর্গানিক ব্লুবেরি", price: 250,
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    category: "অর্গানিক ফলমূল", vendor: "বেরি আনন্দ খামার", vendorId: "v5",
    rating: 4.8, reviewCount: 112, organic: true, inStock: true,
    description: "অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ পরিপুষ্ট অর্গানিক ব্লুবেরি।", unit: "২৫০ গ্রাম"
  },
  {
    id: "7", name: "অর্গানিক হলুদ গুঁড়া", price: 180,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
    category: "অর্গানিক মশলা", vendor: "মশলা মূল কোং", vendorId: "v6",
    rating: 4.7, reviewCount: 94, organic: true, inStock: true,
    description: "অর্গানিক খামার থেকে প্রিমিয়াম হলুদ গুঁড়া।", unit: "২০০ গ্রাম"
  },
  {
    id: "8", name: "অর্গানিক বাদামী চাল", price: 160,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    category: "অর্গানিক শস্য", vendor: "সোনালী মাঠ", vendorId: "v7",
    rating: 4.6, reviewCount: 67, organic: true, inStock: true,
    description: "আঁশ সমৃদ্ধ পুষ্টিকর অর্গানিক বাদামী চাল।", unit: "১ কেজি"
  },
];

export const vendors: Vendor[] = [
  {
    id: "v1", name: "সবুজ উপত্যকা খামার", description: "১৯৯৮ সাল থেকে তাজা শাকসবজিতে বিশেষজ্ঞ পারিবারিক অর্গানিক খামার।",
    rating: 4.8, reviewCount: 342, productCount: 28, location: "রংপুর, বাংলাদেশ",
    certified: true, image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=300&fit=crop"
  },
  {
    id: "v2", name: "সূর্যোদয় অর্গানিকস", description: "টেকসই পদ্ধতিতে উৎপাদিত প্রিমিয়াম অর্গানিক ফল।",
    rating: 4.7, reviewCount: 218, productCount: 19, location: "রাজশাহী, বাংলাদেশ",
    certified: true, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=300&fit=crop"
  },
  {
    id: "v3", name: "মৌ প্রকৃতি কোং", description: "অর্গানিক মৌচাক থেকে কারিগরি মধু ও মৌমাছি পণ্য।",
    rating: 4.9, reviewCount: 156, productCount: 8, location: "সুন্দরবন, বাংলাদেশ",
    certified: true, image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop"
  },
  {
    id: "v4", name: "সুখী গাভী ডেইরি", description: "মুক্ত পরিবেশে ঘাস খাওয়া গাভীর অর্গানিক দুগ্ধ।",
    rating: 4.7, reviewCount: 189, productCount: 12, location: "ময়মনসিংহ, বাংলাদেশ",
    certified: true, image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&h=300&fit=crop"
  },
];

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