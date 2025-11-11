import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample product data templates
const productTemplates = {
  electronics: [
    { name: 'Wireless Headphones', priceRange: [50, 300] },
    { name: 'Smart Watch', priceRange: [100, 500] },
    { name: 'Laptop Stand', priceRange: [25, 80] },
    { name: 'USB-C Hub', priceRange: [30, 120] },
    { name: 'Bluetooth Speaker', priceRange: [40, 200] },
    { name: 'Phone Case', priceRange: [10, 50] },
    { name: 'Charging Cable', priceRange: [15, 40] },
    { name: 'Power Bank', priceRange: [35, 100] },
    { name: 'Webcam', priceRange: [60, 250] },
    { name: 'Gaming Mouse', priceRange: [45, 150] },
  ],
  fashion: [
    { name: 'T-Shirt', priceRange: [15, 60] },
    { name: 'Jeans', priceRange: [40, 120] },
    { name: 'Sneakers', priceRange: [50, 200] },
    { name: 'Backpack', priceRange: [35, 100] },
    { name: 'Sunglasses', priceRange: [25, 150] },
    { name: 'Watch', priceRange: [80, 300] },
    { name: 'Dress', priceRange: [45, 150] },
    { name: 'Jacket', priceRange: [70, 250] },
    { name: 'Scarf', priceRange: [20, 80] },
    { name: 'Wallet', priceRange: [30, 100] },
  ],
  home: [
    { name: 'Coffee Maker', priceRange: [50, 200] },
    { name: 'Desk Lamp', priceRange: [25, 80] },
    { name: 'Plant Pot', priceRange: [15, 50] },
    { name: 'Throw Pillow', priceRange: [20, 60] },
    { name: 'Kitchen Knife Set', priceRange: [40, 120] },
    { name: 'Cutting Board', priceRange: [20, 50] },
    { name: 'Wall Art', priceRange: [30, 100] },
    { name: 'Storage Box', priceRange: [15, 45] },
    { name: 'Curtains', priceRange: [35, 100] },
    { name: 'Mirror', priceRange: [40, 150] },
  ],
  sports: [
    { name: 'Yoga Mat', priceRange: [20, 80] },
    { name: 'Water Bottle', priceRange: [15, 50] },
    { name: 'Running Shoes', priceRange: [60, 200] },
    { name: 'Dumbbells', priceRange: [30, 100] },
    { name: 'Fitness Tracker', priceRange: [40, 150] },
    { name: 'Gym Bag', priceRange: [25, 70] },
    { name: 'Resistance Bands', priceRange: [15, 40] },
    { name: 'Jump Rope', priceRange: [10, 30] },
    { name: 'Exercise Ball', priceRange: [25, 60] },
    { name: 'Sports Watch', priceRange: [50, 180] },
  ]
};

const categories = Object.keys(productTemplates);

const descriptions = [
  'High-quality product with excellent customer reviews',
  'Premium quality material and craftsmanship',
  'Bestseller with thousands of satisfied customers',
  'Professional grade equipment for everyday use',
  'Stylish and functional design',
  'Durable and long-lasting construction',
  'Great value for money',
  'Innovative features and modern design',
  'Perfect for home and office use',
  'Recommended by professionals'
];

const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

function getRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCommission(): number {
  return Math.floor(Math.random() * 16) + 5; // 5-20% commission
}

function generateProductName(template: any, index: number): string {
  const adjectives = ['Premium', 'Professional', 'Deluxe', 'Advanced', 'Classic', 'Modern', 'Eco-Friendly', 'Smart', 'Ultra', 'Pro'];
  const adjective = adjectives[index % adjectives.length];
  return `${adjective} ${template.name}`;
}

function generateProducts(count: number, sellerId: number) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const templateIndex = Math.floor(i / categories.length) % productTemplates[category as keyof typeof productTemplates].length;
    const template = productTemplates[category as keyof typeof productTemplates][templateIndex];

    const product = {
      name: generateProductName(template, i),
      description: descriptions[i % descriptions.length],
      price: getRandomPrice(template.priceRange[0], template.priceRange[1]),
      category: category.charAt(0).toUpperCase() + category.slice(1),
      commission: getRandomCommission(),
      stock: Math.floor(Math.random() * 100) + 10, // 10-109 stock
      location: locations[i % locations.length],
      country: 'USA',
      sellerId: sellerId,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    };

    products.push(product);
  }

  return products;
}

async function addTestProducts() {
  try {
    console.log('Connecting to database...');

    // Use the existing seller ID (103669)
    const sellerId = 103669;

    console.log(`Generating 100 test products for seller ${sellerId}...`);
    const products = generateProducts(100, sellerId);

    console.log('Inserting products into database...');

    // Insert products in batches to avoid overwhelming the database
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      for (const product of batch) {
        await prisma.tbl_products.create({
          data: product
        });
        insertedCount++;

        if (insertedCount % 10 === 0) {
          console.log(`Inserted ${insertedCount} products...`);
        }
      }
    }

    console.log(`Successfully added ${insertedCount} test products!`);

    // Verify the insertion
    const totalProducts = await prisma.tbl_products.count({
      where: { sellerId: sellerId }
    });

    console.log(`Total products for seller ${sellerId}: ${totalProducts}`);

  } catch (error) {
    console.error('Error adding test products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTestProducts();