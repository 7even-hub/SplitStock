// Turns a number into Naira text, e.g. 1500 -> ₦1,500
export const naira = (n) => '₦' + n.toLocaleString('en-NG');

// Products shown on the Record Sale page
export const products = [
  { id: 1, name: 'Cola 50cl', price: 250, stock: 45, cat: 'Beverages' },
  { id: 2, name: 'Premium Rice 1kg', price: 1500, stock: 3, cat: 'Grains' },
  { id: 3, name: 'Instant Noodles Pack', price: 150, stock: 120, cat: 'Snacks' },
  { id: 4, name: 'Sliced Bread Family Size', price: 800, stock: 15, cat: 'Snacks' },
  { id: 5, name: 'Evaporated Milk 170g', price: 450, stock: 88, cat: 'Beverages' },
];

// Best-selling products shown on the Reports & Profit page
export const topMakers = [
  { name: 'Peak Milk Tin (400g)', cat: 'Dairy & Provisions', profit: 45200 },
  { name: 'Coca-Cola 50cl PET', cat: 'Beverages', profit: 38500 },
  { name: 'Indomie Super Pack', cat: 'Groceries', profit: 32150 },
  { name: 'Golden Penny Pasta', cat: 'Groceries', profit: 28900 },
  { name: 'Gino Tomato Paste (Sachet)', cat: 'Cooking Essentials', profit: 21400 },
];