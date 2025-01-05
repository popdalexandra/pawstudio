import {hashSync} from 'bcrypt-ts-edge';

const sampleData = {
  users:[
    {
    name: 'Denisa',
    email: 'admin@example.com',
    password: hashSync('123456', 10),
    role: 'admin'
    },
    {
      name: 'Mihnea',
      email: 'user@example.com',
      password: hashSync('123456', 10),
      role: 'user'
      }
  ],
  products: [
    {
      name: 'Tablou Dogue',
      slug: 'tablou-dogue',
      category: "Animale",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/pets/p1-1.jpg',
        '/images/sample-products/pets/p1-2.jpg',
      ],
      price: 59.99,
      brand: 'Animale',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'Tablou Catue',
      slug: 'tablou-catue',
      category: "Animale",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/pets/p2-1.png',
        '/images/sample-products/pets/p2-2.jpg',
      ],
      price: 85.9,
      brand: 'Animale',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      name: 'Tablou Bebe 1',
      slug: 'tablou-bebe-1',
      category: "Familie",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/family/f1-1.jpg',
        '/images/sample-products/family/f1-2.jpg',
      ],
      price: 99.95,
      brand: 'Familie',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Tablou Bebe 2',
      slug: 'tablou-bebe-2',
      category: "Familie",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/family/f2-1.jpg',
        '/images/sample-products/family/f2-2.jpg',
      ],
      price: 39.95,
      brand: 'Familie',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Tablou Bebe 3',
      slug: 'tablou-bebe-3',
      category: "Familie",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/family/f3-1.jpg',
        '/images/sample-products/family/f3-2.jpg',
      ],
      price: 79.99,
      brand: 'Familie',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Tablou Money',
      slug: 'tablou-money',
      category: "Money",
      description: 'Tablou personalizat',
      images: [
        '/images/sample-products/money/m1-1.jpg',
        '/images/sample-products/money/m2-2.jpg',
      ],
      price: 99.99,
      brand: 'Money',
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
