export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  images?: string[];
  category: string;
  notes?: string[];
  sizes?: string[];
  material?: string;
  featured?: boolean;
  variantType?: string;
  variants?: { label: string; price: number }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  sizeLabel?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Velvet Rose',
    price: 185,
    description: 'A sophisticated blend of Damask rose and smoky oud.',
    longDescription: 'Velvet Rose is an olfactory masterpiece that captures the essence of a moonlit garden. The deep, rich notes of Damask rose are perfectly balanced by the mysterious warmth of smoky oud and a hint of clove.',
    image: '/images/velvet-rose.png',
    category: 'Floral',
    notes: ['Damask Rose', 'Oud', 'Clove', 'Praline'],
    featured: true
  },
  {
    id: '2',
    name: 'Golden Amber',
    price: 210,
    description: 'Warm, resinous amber with hints of vanilla and spice.',
    longDescription: 'Golden Amber evokes the feeling of a warm sunset over the Mediterranean. It opens with bright citrus notes that melt into a heart of rich amber and labdanum, finishing with a creamy vanilla base.',
    image: '/images/golden-amber.png',
    category: 'Oriental',
    notes: ['Amber', 'Vanilla', 'Labdanum', 'Bergamot'],
    featured: true
  },
  {
    id: '3',
    name: 'Cedar Mist',
    price: 165,
    description: 'Fresh mountain air meets ancient cedar forests.',
    longDescription: 'Cedar Mist is a breath of fresh air. It combines the crispness of mountain dew with the grounding presence of cedarwood and sandalwood, creating a scent that is both invigorating and calming.',
    image: '/images/cedar-mist.png',
    category: 'Woody',
    notes: ['Cedarwood', 'Sandalwood', 'Juniper', 'White Musk'],
    featured: true
  },
  {
    id: '4',
    name: 'Citrus Bloom',
    price: 145,
    description: 'Zesty neroli and orange blossom on a bed of white musk.',
    longDescription: 'Citrus Bloom is pure sunshine in a bottle. The sparkling notes of neroli and bergamot lead into a delicate heart of orange blossom, creating a fragrance that is light, airy, and undeniably elegant.',
    image: '/images/citrus-bloom.png',
    category: 'Citrus',
    notes: ['Neroli', 'Orange Blossom', 'Bergamot', 'Petitgrain'],
    featured: true
  },
  {
    id: '13',
    name: 'Essential White Tee',
    price: 45,
    description: 'Ultra-soft premium cotton t-shirt with a perfect drape.',
    longDescription: 'The Essential White Tee is a cornerstone of any minimalist wardrobe. Crafted from 100% long-staple organic cotton, it features a clean silhouette, a refined neckline, and a weight that feels substantial yet breathable.',
    image: '/images/tshirt.png',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Organic Cotton',
    featured: true
  },
  {
    id: '14',
    name: 'Midnight Oversized Hoodie',
    price: 120,
    description: 'Heavyweight premium fleece hoodie in a deep midnight black.',
    longDescription: 'Our Midnight Oversized Hoodie redefines comfort. Made from a custom-developed heavyweight 500GSM fleece, it offers a structured yet soft feel, featuring drop shoulders and a double-lined hood for a truly premium aesthetic.',
    image: '/images/hoodie.png',
    category: 'Apparel',
    sizes: ['M', 'L', 'XL'],
    material: 'Heavyweight Fleece',
    featured: true
  },
  {
    id: '15',
    name: 'Tailored Linen Trousers',
    price: 155,
    description: 'Breathable Italian linen trousers with a modern tailored fit.',
    longDescription: 'The Tailored Linen Trousers are designed for effortless elegance. Crafted from premium Italian linen, these trousers feature a slightly tapered leg, hidden zip closure, and a waistband that provides comfort without sacrificing sharp style.',
    image: '/images/trousers.png',
    category: 'Apparel',
    sizes: ['30', '32', '34', '36'],
    material: '100% Italian Linen',
    featured: true
  },
  {
    id: '5',
    name: 'Midnight Jasmine',
    price: 195,
    description: 'Intoxicating jasmine blooms under the stars.',
    longDescription: 'Midnight Jasmine is a tribute to the nocturnal beauty of the jasmine flower. It is a seductive and powerful fragrance, enriched with notes of ylang-ylang and a base of warm musk.',
    image: '/images/midnight-jasmine.png',
    category: 'Floral',
    notes: ['Jasmine', 'Ylang-Ylang', 'Musk', 'Tuberose']
  },
  {
    id: '6',
    name: 'Sandalwood Soul',
    price: 225,
    description: 'Creamy Australian sandalwood with a touch of cardamom.',
    longDescription: 'Sandalwood Soul is a deep, meditative fragrance. The creamy richness of Australian sandalwood is elevated by the spicy warmth of cardamom and a hint of papyrus, creating a truly unique signature scent.',
    image: '/images/sandalwood-soul.png',
    category: 'Woody',
    notes: ['Sandalwood', 'Cardamom', 'Papyrus', 'Leather']
  },
  {
    id: '7',
    name: 'Oceanic Drift',
    price: 155,
    description: 'Crisp sea salt and mineral notes with a heart of sage.',
    longDescription: 'Oceanic Drift captures the raw energy of the Atlantic coast. Sparkling sea salt and mineral notes are grounded by earthy sage and ambrette seeds, creating a fragrance that is both fresh and sophisticated.',
    image: '/images/oceanic-drift.png',
    category: 'Citrus',
    notes: ['Sea Salt', 'Sage', 'Ambrette', 'Grapefruit']
  },
  {
    id: '8',
    name: 'Spiced Saffron',
    price: 240,
    description: 'Rare saffron and black pepper with a base of dark leather.',
    longDescription: 'Spiced Saffron is an opulent and mysterious fragrance. The vibrant, honeyed notes of saffron are sharpened by black pepper and wrapped in a rich, supple leather accord for a truly commanding presence.',
    image: '/images/spiced-saffron.png',
    category: 'Oriental',
    notes: ['Saffron', 'Black Pepper', 'Leather', 'Raspberry']
  },
  {
    id: '9',
    name: 'White Musk',
    price: 135,
    description: 'Pure, clean musk with delicate notes of lily of the valley.',
    longDescription: 'White Musk is the ultimate "skin scent." It is clean, comforting, and subtly sensual, combining the purity of white musk with the delicate floral notes of lily of the valley and iris.',
    image: '/images/white-musk.png',
    category: 'Floral',
    notes: ['White Musk', 'Lily of the Valley', 'Iris', 'Cotton Flower']
  },
  {
    id: '10',
    name: 'Smoky Vetiver',
    price: 175,
    description: 'Earthy vetiver root with a touch of roasted coffee.',
    longDescription: 'Smoky Vetiver is a sophisticated take on a classic note. The deep, earthy tones of Haitian vetiver are given a modern twist with a hint of roasted coffee and smoky guaiac wood.',
    image: '/images/smoky-vetiver.png',
    category: 'Woody',
    notes: ['Vetiver', 'Coffee', 'Guaiac Wood', 'Pink Pepper']
  },
  {
    id: '11',
    name: 'Bergamot Breeze',
    price: 150,
    description: 'Sparkling Italian bergamot and fresh green tea.',
    longDescription: 'Bergamot Breeze is an invigorating journey to the Italian coast. The zesty brightness of bergamot is perfectly complemented by the calming notes of green tea and a hint of white ginger.',
    image: '/images/bergamot-breeze.png',
    category: 'Citrus',
    notes: ['Bergamot', 'Green Tea', 'Ginger', 'Lemon']
  },
  {
    id: '12',
    name: 'Patchouli Night',
    price: 205,
    description: 'Dark patchouli and cocoa with a hint of dried fruits.',
    longDescription: 'Patchouli Night is a rich, gourmand-leaning fragrance. The deep, woody character of patchouli is softened by the bitterness of dark cocoa and the sweetness of dried plum, creating a scent that is perfect for the evening.',
    image: '/images/patchouli-night.png',
    category: 'Oriental',
    notes: ['Patchouli', 'Cocoa', 'Plum', 'Vanilla Bean']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Layering Fragrances',
    excerpt: 'Discover how to create your own unique signature scent by combining different notes.',
    date: 'March 15, 2026',
    image: '/images/blog-layering.png'
  },
  {
    id: '2',
    title: 'Sourcing the Finest Grasse Jasmine',
    excerpt: 'A journey to the heart of French perfumery to find the most exquisite ingredients.',
    date: 'March 10, 2026',
    image: '/images/blog-jasmine.png'
  },
  {
    id: '3',
    title: 'Fragrance Trends for Spring 2026',
    excerpt: 'From solar notes to green florals, explore what is trending this season.',
    date: 'March 5, 2026',
    image: '/images/blog-trends.png'
  }
];
