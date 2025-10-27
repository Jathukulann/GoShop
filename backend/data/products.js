// Sample product data for seeding
const products = [
  // Men's T-Shirts
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Premium quality 100% cotton t-shirt with a comfortable fit. Perfect for everyday wear. Breathable fabric that keeps you cool all day long.',
    price: 29.99,
    discountPrice: 24.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Grey'],
    stock: 100,
    isFeatured: true,
  },
  {
    name: 'V-Neck Premium T-Shirt',
    description: 'Stylish v-neck t-shirt made from soft cotton blend. Features a modern slim fit design that complements any casual outfit.',
    price: 34.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Maroon'],
    stock: 75,
    isFeatured: false,
  },
  {
    name: 'Graphic Print T-Shirt',
    description: 'Trendy graphic print t-shirt with unique designs. Made from 100% combed cotton for superior comfort and durability.',
    price: 39.99,
    discountPrice: 29.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'T-Shirts',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Blue'],
    stock: 90,
    isFeatured: true,
  },

  // Men's Shirts
  {
    name: 'Formal Cotton Shirt',
    description: 'Professional formal shirt perfect for office wear. Wrinkle-resistant fabric with a classic collar design.',
    price: 49.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Pink'],
    stock: 60,
    isFeatured: false,
  },
  {
    name: 'Casual Check Shirt',
    description: 'Comfortable casual check shirt ideal for weekend outings. Made from soft cotton with a relaxed fit.',
    price: 44.99,
    discountPrice: 39.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Green', 'Red'],
    stock: 80,
    isFeatured: true,
  },

  // Men's Jeans
  {
    name: 'Slim Fit Denim Jeans',
    description: 'Modern slim fit jeans with stretch denim fabric. Features five-pocket styling and a comfortable mid-rise waist.',
    price: 79.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Jeans',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    stock: 70,
    isFeatured: true,
  },
  {
    name: 'Regular Fit Jeans',
    description: 'Classic regular fit jeans with durable denim construction. Versatile style that works for any occasion.',
    price: 69.99,
    discountPrice: 59.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Jeans',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black', 'Grey'],
    stock: 85,
    isFeatured: false,
  },

  // Men's Jackets
  {
    name: 'Leather Biker Jacket',
    description: 'Premium genuine leather jacket with asymmetric zip closure. Features multiple pockets and a classic biker design.',
    price: 199.99,
    discountPrice: 179.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Jackets',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    stock: 40,
    isFeatured: true,
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with button closure. Versatile layering piece perfect for casual wear.',
    price: 89.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    stock: 55,
    isFeatured: false,
  },

  // Women's Dresses
  {
    name: 'Floral Summer Dress',
    description: 'Beautiful floral print dress perfect for summer days. Lightweight fabric with a flattering A-line silhouette.',
    price: 69.99,
    discountPrice: 54.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Pink', 'Floral Blue', 'Floral Yellow'],
    stock: 65,
    isFeatured: true,
  },
  {
    name: 'Elegant Evening Dress',
    description: 'Sophisticated evening dress with elegant draping. Perfect for formal occasions and special events.',
    price: 129.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    stock: 50,
    isFeatured: true,
  },
  {
    name: 'Casual Midi Dress',
    description: 'Comfortable midi dress for everyday wear. Features a relaxed fit and soft jersey fabric.',
    price: 54.99,
    discountPrice: 44.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'Olive'],
    stock: 70,
    isFeatured: false,
  },

  // Women's Tops
  {
    name: 'Silk Blouse',
    description: 'Luxurious silk blouse with a sophisticated design. Perfect for both office and evening wear.',
    price: 79.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Tops',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Cream', 'Light Pink'],
    stock: 60,
    isFeatured: true,
  },
  {
    name: 'Cotton Tank Top',
    description: 'Essential cotton tank top with a comfortable fit. Great for layering or wearing alone.',
    price: 24.99,
    discountPrice: 19.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Grey', 'Navy'],
    stock: 120,
    isFeatured: false,
  },

  // Women's Jeans
  {
    name: "Women's Skinny Jeans",
    description: 'Trendy skinny fit jeans with stretch denim. Features a high-rise waist for a flattering silhouette.',
    price: 74.99,
    discountPrice: 64.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Jeans',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Black', 'Light Blue'],
    stock: 85,
    isFeatured: true,
  },
  {
    name: 'Boyfriend Jeans',
    description: 'Relaxed boyfriend fit jeans with distressed details. Comfortable and stylish for casual wear.',
    price: 69.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Jeans',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    stock: 70,
    isFeatured: false,
  },

  // Women's Jackets
  {
    name: 'Trench Coat',
    description: 'Classic trench coat with belted waist. Water-resistant fabric perfect for rainy days.',
    price: 149.99,
    discountPrice: 129.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Jackets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'Navy'],
    stock: 45,
    isFeatured: true,
  },
  {
    name: 'Bomber Jacket',
    description: 'Stylish bomber jacket with ribbed cuffs and hem. Lightweight yet warm, perfect for transitional weather.',
    price: 94.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800',
      },
    ],
    category: 'Women',
    subcategory: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive', 'Burgundy'],
    stock: 55,
    isFeatured: false,
  },

  // Kids' T-Shirts
  {
    name: "Kids' Graphic T-Shirt",
    description: 'Fun graphic print t-shirt for kids. Made from soft, durable cotton that withstands active play.',
    price: 19.99,
    discountPrice: 14.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      },
    ],
    category: 'Kids',
    subcategory: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue', 'Red', 'Green', 'Yellow'],
    stock: 100,
    isFeatured: true,
  },
  {
    name: "Kids' Basic T-Shirt Pack",
    description: 'Essential pack of plain t-shirts for kids. Comfortable everyday wear in multiple colors.',
    price: 29.99,
    discountPrice: 24.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
      },
    ],
    category: 'Kids',
    subcategory: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Multi-color'],
    stock: 90,
    isFeatured: false,
  },

  // Kids' Jeans
  {
    name: "Kids' Denim Jeans",
    description: 'Durable denim jeans designed for active kids. Features reinforced knees and adjustable waist.',
    price: 39.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
      },
    ],
    category: 'Kids',
    subcategory: 'Jeans',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue', 'Black'],
    stock: 75,
    isFeatured: true,
  },

  // Men's Sweaters
  {
    name: 'Wool Blend Sweater',
    description: 'Warm wool blend sweater perfect for cold weather. Features a classic crew neck design.',
    price: 89.99,
    discountPrice: 74.99,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Sweaters',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Grey', 'Black'],
    stock: 65,
    isFeatured: true,
  },
  {
    name: 'Cardigan Sweater',
    description: 'Versatile cardigan sweater with button closure. Perfect for layering in any season.',
    price: 79.99,
    discountPrice: 0,
    images: [
      {
        public_id: 'sample',
        url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      },
    ],
    category: 'Men',
    subcategory: 'Sweaters',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Navy', 'Brown'],
    stock: 55,
    isFeatured: false,
  },
];

module.exports = products;
