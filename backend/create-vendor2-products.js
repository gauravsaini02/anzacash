const fs = require('fs');

// Sample product data templates focused on tech/electronics for TechVendor Plus
const techProductTemplates = {
  computers: [
    { name: 'Gaming Laptop', priceRange: [800, 2500] },
    { name: 'Ultrabook', priceRange: [600, 1800] },
    { name: 'Desktop Computer', priceRange: [500, 2000] },
    { name: 'All-in-One PC', priceRange: [700, 1500] },
    { name: 'Mini PC', priceRange: [400, 1200] },
    { name: 'Workstation', priceRange: [1500, 4000] },
  ],
  accessories: [
    { name: 'Mechanical Keyboard', priceRange: [80, 300] },
    { name: 'Gaming Mouse', priceRange: [40, 150] },
    { name: 'Monitor 4K', priceRange: [300, 800] },
    { name: 'Webcam HD', priceRange: [50, 200] },
    { name: 'USB Hub', priceRange: [25, 100] },
    { name: 'Laptop Stand', priceRange: [30, 80] },
  ],
  audio: [
    { name: 'Noise-Cancelling Headphones', priceRange: [150, 400] },
    { name: 'Wireless Earbuds', priceRange: [80, 250] },
    { name: 'Bluetooth Speaker', priceRange: [40, 200] },
    { name: 'Studio Monitor Headphones', priceRange: [100, 350] },
    { name: 'Soundbar', priceRange: [120, 500] },
  ],
  mobile: [
    { name: 'Smartphone Case', priceRange: [15, 60] },
    { name: 'Screen Protector', priceRange: [10, 40] },
    { name: 'Wireless Charger', priceRange: [30, 100] },
    { name: 'Phone Grip', priceRange: [10, 30] },
    { name: 'Car Mount', priceRange: [20, 60] },
    { name: 'Cable Set', priceRange: [25, 80] },
  ],
  gaming: [
    { name: 'Gaming Chair', priceRange: [200, 600] },
    { name: 'Gaming Desk', priceRange: [150, 400] },
    { name: 'Controller', priceRange: [40, 120] },
    { name: 'Gaming Headset', priceRange: [60, 200] },
    { name: 'Mouse Pad XXL', priceRange: [20, 60] },
  ]
};

const categories = Object.keys(techProductTemplates);

const techDescriptions = [
  'Professional grade equipment with cutting-edge technology',
  'Premium quality materials and superior craftsmanship',
  'Engineered for performance and reliability',
  'Latest technology with advanced features',
  'Designed for professionals and enthusiasts',
  'Sleek design with powerful performance',
  'Innovation meets affordability in this amazing product',
  'Transform your workspace with this modern solution',
  'Experience the future of technology today',
  'Trusted by tech enthusiasts worldwide',
  'Unmatched quality and performance guarantee',
  'Ergonomic design for maximum comfort'
];

const canadianLocations = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Victoria'];

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCommission() {
  return Math.floor(Math.random() * 11) + 8; // 8-18% commission for this vendor
}

function generateProductName(template, index) {
  const techAdjectives = ['Pro', 'Elite', 'Advanced', 'Professional', 'Ultra', 'Smart', 'Digital', 'Next-Gen', 'Premium', 'Tech'];
  const adjective = techAdjectives[index % techAdjectives.length];
  return `${adjective} ${template.name}`;
}

function generateTechProducts(count) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const templateIndex = Math.floor(i / categories.length) % techProductTemplates[category].length;
    const template = techProductTemplates[category][templateIndex];

    const product = {
      name: generateProductName(template, i),
      description: techDescriptions[i % techDescriptions.length],
      price: getRandomPrice(template.priceRange[0], template.priceRange[1]),
      category: category.charAt(0).toUpperCase() + category.slice(1),
      commission: getRandomCommission(),
      stock: Math.floor(Math.random() * 80) + 20, // 20-99 stock
      location: canadianLocations[i % canadianLocations.length],
      country: 'Canada',
      date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 45 days
    };

    products.push(product);
  }

  return products;
}

// Generate products and save to file
console.log('Generating 50 tech-focused products for TechVendor Plus...');
const products = generateTechProducts(50);

// Save to JSON file
fs.writeFileSync('techvendor2-products.json', JSON.stringify(products, null, 2));
console.log('Saved 50 products to techvendor2-products.json');

// Display some sample products
console.log('\n=== Sample Products ===');
products.slice(0, 5).forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Category: ${product.category} | Price: $${product.price} | Commission: ${product.commission}%`);
  console.log(`   Location: ${product.location}, ${product.country}`);
  console.log(`   Description: ${product.description}\n`);
});

console.log(`\nGenerated ${products.length} products for TechVendor Plus!`);
console.log('Ready to insert into database with vendor ID: 103674');