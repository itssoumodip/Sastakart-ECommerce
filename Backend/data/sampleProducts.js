const sampleProducts = [  {
    title: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life. Experience crystal-clear audio with deep bass and comfortable over-ear design perfect for music lovers and professionals.",
    price: 16599,
    discountPrice: 12449,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "TechSound",
    stock: 25,
    rating: 4.5,
    numReviews: 128,
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Quick charge technology",
      "Comfortable padding"
    ],
    specifications: {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "250g",
      "Warranty": "2 years"
    },
    tags: ["headphones", "wireless", "bluetooth", "noise-cancelling"],
    reviews: []
  },
  {
    title: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS tracking, and 7-day battery life. Track your workouts, monitor your health, and stay connected with smart notifications.",
    price: 24899,
    discountPrice: 20739,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "FitTech",
    stock: 40,
    rating: 4.7,
    numReviews: 89,
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "7-day battery life",
      "Water resistant",
      "Sleep tracking"
    ],
    specifications: {
      "Battery Life": "7 days",
      "Display": "1.4 inch AMOLED",
      "Water Resistance": "5ATM",
      "Compatibility": "iOS & Android"
    },
    tags: ["smartwatch", "fitness", "health", "gps"],
    reviews: []
  },
  {    title: "Vintage Leather Jacket",
    description: "Classic genuine leather jacket with vintage styling. Crafted from premium cowhide leather with attention to detail. Perfect for casual and formal occasions.",
    price: 33199,
    discountPrice: 24899,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
    ],
    category: "Clothing",
    brand: "RetroStyle",
    stock: 15,
    rating: 4.3,
    numReviews: 67,
    features: [
      "Genuine leather",
      "Multiple pockets",
      "Vintage styling",
      "Comfortable fit",
      "Durable construction"
    ],
    specifications: {
      "Material": "100% Genuine Leather",
      "Care": "Professional cleaning recommended",
      "Origin": "Made in Italy",
      "Sizes": "S, M, L, XL, XXL"
    },
    tags: ["leather", "jacket", "vintage", "fashion"],
    reviews: []
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Compact wireless speaker with 360-degree sound and 12-hour battery. Perfect for outdoor adventures, parties, and home entertainment with rich, full sound.",    price: 6639,
    discountPrice: 4979,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "SoundWave",
    stock: 60,
    rating: 4.4,
    numReviews: 234,
    features: [
      "360-degree sound",
      "12-hour battery",
      "Waterproof design",
      "Hands-free calling",
      "Compact size"
    ],
    specifications: {
      "Battery Life": "12 hours",
      "Connectivity": "Bluetooth 5.0",
      "Water Rating": "IPX7",
      "Weight": "400g"
    },
    tags: ["speaker", "bluetooth", "portable", "waterproof"],
    reviews: []
  },
  {    title: "Organic Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt with premium quality fabric. Soft, breathable, and sustainably made. Available in multiple colors and sizes.",
    price: 2489,
    discountPrice: 1659,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4fg3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"
    ],
    category: "Clothing",
    brand: "EcoWear",
    stock: 100,
    rating: 4.6,
    numReviews: 156,
    features: [
      "100% Organic cotton",
      "Pre-shrunk",
      "Machine washable",
      "Breathable fabric",
      "Sustainable production"
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold",
      "Sizes": "XS, S, M, L, XL, XXL"
    },
    tags: ["t-shirt", "organic", "cotton", "sustainable"],
    reviews: []
  },
  {    title: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography. Sharp images, beautiful bokeh, and exceptional low-light performance for portrait and street photography.",
    price: 49799,
    discountPrice: 41459,
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500634245200-e5814f60a7c4?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606983725131-57849aaadcc4?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "LensCraft",
    stock: 12,
    rating: 4.8,
    numReviews: 78,
    features: [
      "50mm focal length",
      "f/1.8 aperture",
      "Image stabilization",
      "Weather sealed",
      "Professional quality"
    ],
    specifications: {
      "Focal Length": "50mm",
      "Maximum Aperture": "f/1.8",
      "Mount": "Universal",
      "Weight": "350g"
    },
    tags: ["camera", "lens", "photography", "professional"],
    reviews: []
  },
  {    title: "Ceramic Coffee Mug Set",
    description: "Elegant set of 4 ceramic coffee mugs with modern design. Perfect for your morning coffee or tea. Dishwasher and microwave safe with comfortable handle design.",
    price: 4149,
    discountPrice: 2904,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=600&fit=crop"
    ],
    category: "Home & Kitchen",
    brand: "CeramicCraft",
    stock: 45,
    rating: 4.5,
    numReviews: 198,
    features: [
      "Set of 4 mugs",
      "Ceramic material",
      "Dishwasher safe",
      "Microwave safe",
      "Comfortable handle"
    ],
    specifications: {
      "Material": "High-quality ceramic",
      "Capacity": "350ml each",
      "Care": "Dishwasher and microwave safe",
      "Set": "4 pieces"
    },
    tags: ["coffee", "mug", "ceramic", "kitchen"],
    reviews: []
  },  {
    title: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard with tactile switches. Features customizable lighting, anti-ghosting technology, and durable construction for competitive gaming.",
    price: 13279,
    discountPrice: 9959,
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "GameTech",
    stock: 35,
    rating: 4.7,
    numReviews: 145,
    features: [
      "Mechanical switches",
      "RGB backlighting",
      "Anti-ghosting",
      "Programmable keys",
      "Durable build"
    ],
    specifications: {
      "Switch Type": "Mechanical Blue",
      "Layout": "Full-size",
      "Connectivity": "USB-C",
      "Compatibility": "Windows, Mac, Linux"
    },
    tags: ["keyboard", "gaming", "mechanical", "rgb"],
    reviews: []
  },  {
    title: "Luxury Skincare Set",
    description: "Complete skincare routine with premium natural ingredients. Includes cleanser, toner, serum, and moisturizer. Suitable for all skin types and dermatologist tested.",
    price: 10789,
    discountPrice: 7469,
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"
    ],
    category: "Beauty & Personal Care",
    brand: "GlowLux",
    stock: 28,
    rating: 4.6,
    numReviews: 203,
    features: [
      "Natural ingredients",
      "Complete routine",
      "All skin types",
      "Dermatologist tested",
      "Cruelty-free"
    ],
    specifications: {
      "Set Includes": "Cleanser, Toner, Serum, Moisturizer",
      "Skin Type": "All types",
      "Volume": "50ml each",
      "Ingredients": "Natural and organic"
    },
    tags: ["skincare", "beauty", "natural", "luxury"],
    reviews: []
  },  {
    title: "Fitness Resistance Bands Set",
    description: "Complete set of resistance bands for full-body workouts. Includes multiple resistance levels, door anchor, and exercise guide. Perfect for home fitness routines.",
    price: 3319,
    discountPrice: 2074,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop"
    ],
    category: "Sports & Outdoors",
    brand: "FitBand",
    stock: 75,
    rating: 4.4,
    numReviews: 312,
    features: [
      "Multiple resistance levels",
      "Door anchor included",
      "Exercise guide",
      "Compact storage",
      "Durable material"
    ],
    specifications: {
      "Resistance Levels": "Light, Medium, Heavy",
      "Material": "Natural latex",
      "Accessories": "Door anchor, ankle straps",
      "Guide": "Workout instruction included"
    },
    tags: ["fitness", "resistance", "workout", "home-gym"],
    reviews: []
  }
];

module.exports = sampleProducts;
