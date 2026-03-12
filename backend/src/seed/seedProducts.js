import dotenv from 'dotenv';
import { initDatabase, pool } from '../models/db.js';

dotenv.config();

const products = [
  // electronics
  {
    name: 'Nothing Phone 2a',
    description: '6.7-inch AMOLED display, 50MP dual camera, 8GB RAM, 128GB storage.',
    price: 23999,
    category: 'electronics',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900'
  },
  {
    name: 'Samsung Galaxy M14 5G',
    description: 'Long battery life smartphone with Exynos chipset and 6000mAh battery.',
    price: 12999,
    category: 'electronics',
    stock: 70,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900'
  },
  {
    name: 'boAt Airdopes 141',
    description: 'True wireless earbuds with up to 42 hours playback and ENx noise cancellation.',
    price: 1499,
    category: 'electronics',
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=900'
  },
  {
    name: 'ASUS Vivobook 15',
    description: 'Intel Core i5 laptop with 16GB RAM and 512GB SSD.',
    price: 54990,
    category: 'electronics',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900'
  },
  {
    name: 'HP Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking for daily work.',
    price: 799,
    category: 'electronics',
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900'
  },
  {
    name: 'Fire-Boltt Ninja Call Pro',
    description: 'Bluetooth calling smart watch with SpO2 and heart-rate monitor.',
    price: 1799,
    category: 'electronics',
    stock: 120,
    image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900'
  },

  // fashion
  {
    name: 'Men Slim Fit Cotton Shirt',
    description: 'Premium cotton shirt suitable for office and casual wear.',
    price: 899,
    category: 'fashion',
    stock: 90,
    image_url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900'
  },
  {
    name: 'Women Printed Kurti',
    description: 'Lightweight rayon kurti with all-over print and comfortable fit.',
    price: 699,
    category: 'fashion',
    stock: 110,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900'
  },
  {
    name: 'Running Sneakers',
    description: 'Breathable sneakers with extra cushioning for daily jogging.',
    price: 1899,
    category: 'fashion',
    stock: 80,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'
  },
  {
    name: 'Classic Analog Watch',
    description: 'Minimalist analog watch with leather strap and quartz movement.',
    price: 1499,
    category: 'fashion',
    stock: 95,
    image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900'
  },
  {
    name: 'Women Handbag',
    description: 'Spacious PU handbag with zip compartments and shoulder strap.',
    price: 1299,
    category: 'fashion',
    stock: 130,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900'
  },
  {
    name: 'Men Denim Jeans',
    description: 'Stretchable slim-fit jeans with mid-rise waist.',
    price: 1199,
    category: 'fashion',
    stock: 140,
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900'
  },

  // home
  {
    name: 'Memory Foam Pillow',
    description: 'Orthopedic neck support pillow for comfortable sleep.',
    price: 999,
    category: 'home',
    stock: 160,
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900'
  },
  {
    name: 'LED Table Lamp',
    description: 'Dimmable LED desk lamp with touch controls and USB charging.',
    price: 1299,
    category: 'home',
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900'
  },
  {
    name: 'Wooden Wall Shelf',
    description: 'Decorative wall-mounted shelf for books and decor.',
    price: 1499,
    category: 'home',
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900'
  },
  {
    name: 'Dining Chair Set',
    description: 'Set of 2 cushioned dining chairs with metal legs.',
    price: 4999,
    category: 'home',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=900'
  },
  {
    name: 'Door Mat Anti-Skid',
    description: 'Soft anti-skid doormat with easy wash microfiber top.',
    price: 399,
    category: 'home',
    stock: 210,
    image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900'
  },
  {
    name: 'Cotton Bedsheet Queen Size',
    description: 'Premium 300 thread count cotton bedsheet with pillow covers.',
    price: 1299,
    category: 'home',
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900'
  },

  // appliances
  {
    name: 'Philips Air Fryer',
    description: '4.1L rapid air technology fryer for low-oil cooking.',
    price: 8999,
    category: 'appliances',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=900'
  },
  {
    name: 'IFB Microwave Oven 20L',
    description: 'Convection microwave with auto-cook menus and grill mode.',
    price: 7499,
    category: 'appliances',
    stock: 32,
    image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=900'
  },
  {
    name: 'Prestige Induction Cooktop',
    description: 'Energy-efficient induction stove with push-button controls.',
    price: 2499,
    category: 'appliances',
    stock: 75,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900'
  },
  {
    name: 'Kent Water Purifier',
    description: 'RO+UV purification with mineral retention technology.',
    price: 10999,
    category: 'appliances',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=900'
  },
  {
    name: 'LG 1.5 Ton Split AC',
    description: '5-star inverter AC with AI convertible cooling.',
    price: 38999,
    category: 'appliances',
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1581093458791-9d09c9c8f2bb?w=900'
  },
  {
    name: 'Samsung Washing Machine 7kg',
    description: 'Fully automatic top load washing machine with digital inverter.',
    price: 17499,
    category: 'appliances',
    stock: 26,
    image_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=900'
  },

  // books
  {
    name: 'Clean Code',
    description: 'A handbook of agile software craftsmanship by Robert C. Martin.',
    price: 799,
    category: 'books',
    stock: 180,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900'
  },
  {
    name: 'Atomic Habits',
    description: 'Transformative guide to building good habits and breaking bad ones.',
    price: 499,
    category: 'books',
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900'
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    price: 399,
    category: 'books',
    stock: 190,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900'
  },
  {
    name: 'Deep Work',
    description: 'Rules for focused success in a distracted world.',
    price: 549,
    category: 'books',
    stock: 140,
    image_url: 'https://images.unsplash.com/photo-1455885666463-9c3d7d0b1f59?w=900'
  },
  {
    name: 'Introduction to Algorithms',
    description: 'Comprehensive guide to data structures and algorithms.',
    price: 1599,
    category: 'books',
    stock: 85,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900'
  },
  {
    name: 'Sapiens',
    description: 'A brief history of humankind by Yuval Noah Harari.',
    price: 599,
    category: 'books',
    stock: 135,
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=900'
  },

  // extra products for realism
  {
    name: 'Bluetooth Soundbar',
    description: '120W soundbar with deep bass and HDMI ARC.',
    price: 5999,
    category: 'electronics',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900'
  },
  {
    name: 'Gaming Keyboard RGB',
    description: 'Mechanical-feel keyboard with customizable RGB backlight.',
    price: 2199,
    category: 'electronics',
    stock: 98,
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=900'
  },
  {
    name: 'Women Running Tights',
    description: 'High-stretch breathable tights for workouts and yoga.',
    price: 999,
    category: 'fashion',
    stock: 115,
    image_url: 'https://images.unsplash.com/photo-1506629905607-f8f2f5f65fe0?w=900'
  },
  {
    name: 'Men Hoodie Fleece',
    description: 'Warm fleece hoodie with front pocket and full sleeves.',
    price: 1299,
    category: 'fashion',
    stock: 125,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900'
  },
  {
    name: 'Vacuum Flask Set',
    description: 'Stainless steel 1L flask with two insulated bottles.',
    price: 899,
    category: 'home',
    stock: 175,
    image_url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900'
  },
  {
    name: 'Air Purifier Compact',
    description: 'HEPA filter air purifier for bedroom and office use.',
    price: 6999,
    category: 'appliances',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=900'
  },
  {
    name: 'Zero to One',
    description: 'Notes on startups by Peter Thiel.',
    price: 349,
    category: 'books',
    stock: 170,
    image_url: 'https://images.unsplash.com/photo-1473755504818-b72b6dfdc226?w=900'
  },

  // additional catalog products
  {
    name: 'Lenovo IdeaPad Slim 3',
    description: 'AMD Ryzen 5 laptop with 16GB RAM and 512GB SSD for productivity and study.',
    price: 46990,
    category: 'electronics',
    stock: 42,
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900'
  },
  {
    name: 'Canon EOS Mirrorless Camera',
    description: '24MP mirrorless camera with 4K recording and interchangeable lens support.',
    price: 58999,
    category: 'electronics',
    stock: 21,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900'
  },
  {
    name: 'Mi 20000mAh Power Bank',
    description: 'Fast charging power bank with dual output and Type-C input support.',
    price: 2199,
    category: 'electronics',
    stock: 180,
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=900'
  },
  {
    name: 'JBL Bluetooth Speaker',
    description: 'Portable speaker with deep bass, IPX7 rating, and 12-hour playback.',
    price: 3999,
    category: 'electronics',
    stock: 74,
    image_url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=900'
  },
  {
    name: 'Men Casual Polo T-Shirt',
    description: 'Soft cotton-blend polo t-shirt for daily wear comfort.',
    price: 699,
    category: 'fashion',
    stock: 160,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900'
  },
  {
    name: 'Women Ethnic Dupatta Set',
    description: 'Printed ethnic set with lightweight fabric and festive color tones.',
    price: 1199,
    category: 'fashion',
    stock: 95,
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900'
  },
  {
    name: 'Campus Sports Shoes',
    description: 'Breathable sports shoes with anti-slip sole and soft cushioning.',
    price: 1699,
    category: 'fashion',
    stock: 130,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'
  },
  {
    name: 'Leather Wallet for Men',
    description: 'Compact genuine leather wallet with RFID protection.',
    price: 899,
    category: 'fashion',
    stock: 220,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=900'
  },
  {
    name: 'Ceramic Dinner Set 18 pcs',
    description: 'Microwave-safe ceramic dinnerware set with elegant finish.',
    price: 2699,
    category: 'home',
    stock: 58,
    image_url: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=900'
  },
  {
    name: 'Indoor Snake Plant',
    description: 'Low-maintenance indoor air-purifying plant in decorative pot.',
    price: 499,
    category: 'home',
    stock: 145,
    image_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=900'
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Stainless steel knife set with ergonomic handles and stand.',
    price: 1299,
    category: 'home',
    stock: 88,
    image_url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=900'
  },
  {
    name: 'Study Table with Drawers',
    description: 'Engineered wood study table with storage drawers and cable slot.',
    price: 6499,
    category: 'home',
    stock: 33,
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900'
  },
  {
    name: 'Bajaj Electric Kettle 1.8L',
    description: 'Fast-boil stainless steel kettle with auto shut-off feature.',
    price: 1599,
    category: 'appliances',
    stock: 140,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900'
  },
  {
    name: 'Havells Room Heater',
    description: 'Compact room heater with safety grill and overheat protection.',
    price: 2899,
    category: 'appliances',
    stock: 67,
    image_url: 'https://images.unsplash.com/photo-1616594039964-34f8627a4f11?w=900'
  },
  {
    name: 'Samsung 55 inch Smart TV',
    description: '4K UHD smart TV with HDR and voice assistant support.',
    price: 52999,
    category: 'appliances',
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900'
  },
  {
    name: 'Eureka Forbes Vacuum Cleaner',
    description: 'Powerful suction vacuum cleaner with reusable dust bag.',
    price: 5999,
    category: 'appliances',
    stock: 54,
    image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=900'
  },
  {
    name: 'The Almanack of Naval Ravikant',
    description: 'Wisdom on wealth, happiness, and decision-making.',
    price: 449,
    category: 'books',
    stock: 185,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900'
  },
  {
    name: 'Rich Dad Poor Dad',
    description: 'Personal finance classic focused on financial literacy.',
    price: 399,
    category: 'books',
    stock: 240,
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900'
  },
  {
    name: 'Do Epic Shit',
    description: 'Motivational and practical life advice for young professionals.',
    price: 299,
    category: 'books',
    stock: 260,
    image_url: 'https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=900'
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'Software craftsmanship and practical engineering habits.',
    price: 899,
    category: 'books',
    stock: 120,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900'
  }
];

const seed = async () => {
  const client = await pool.connect();

  try {
    await initDatabase();

    await client.query('BEGIN');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM cart_items');
    await client.query('DELETE FROM products');

    for (const product of products) {
      await client.query(
        `
        INSERT INTO products (name, description, price, category, stock, image_url)
        VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [product.name, product.description, product.price, product.category, product.stock, product.image_url]
      );
    }

    await client.query('COMMIT');
    console.log(`Seed complete. Inserted ${products.length} products.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
