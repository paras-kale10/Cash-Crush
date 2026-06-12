/* ============================================
   EXPENSE CATEGORIZER
   AI-like keyword-based categorization
   ============================================ */

const categories = {
  Food: [
    'food', 'restaurant', 'cafe', 'coffee', 'tea', 'pizza', 'burger', 'chicken',
    'biryani', 'dosa', 'idli', 'chai', 'swiggy', 'zomato', 'dominos', 'mcdonalds',
    "mcdonald's", 'kfc', 'subway', 'starbucks', 'grocery', 'groceries', 'vegetables',
    'fruits', 'milk', 'bread', 'rice', 'snack', 'snacks', 'lunch', 'dinner',
    'breakfast', 'meal', 'eat', 'eating', 'thali', 'mess', 'canteen', 'bakery',
    'ice cream', 'juice', 'smoothie', 'chocolate', 'candy', 'biscuit', 'noodles',
    'maggi', 'pasta', 'paneer', 'dal', 'roti', 'paratha', 'momos', 'samosa',
    'pav bhaji', 'vada pav', 'dhaba', 'tiffin', 'barbeque', 'nation', 'haldiram',
  ],
  Transport: [
    'uber', 'ola', 'lyft', 'rapido', 'auto', 'rickshaw', 'taxi', 'cab',
    'bus', 'metro', 'train', 'railway', 'irctc', 'flight', 'airline',
    'petrol', 'diesel', 'fuel', 'gas', 'parking', 'toll', 'transport',
    'travel', 'commute', 'ride', 'bike', 'scooter', 'car',
  ],
  Entertainment: [
    'netflix', 'hotstar', 'prime', 'amazon prime', 'spotify', 'youtube',
    'movie', 'cinema', 'pvr', 'inox', 'theatre', 'concert', 'show',
    'game', 'gaming', 'steam', 'playstation', 'xbox', 'subscription',
    'disney', 'hbo', 'jio', 'fun', 'party', 'club', 'bar', 'pub',
    'drink', 'alcohol', 'beer', 'wine', 'hookah', 'bowling', 'arcade',
  ],
  Shopping: [
    'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopping', 'mall',
    'clothes', 'clothing', 'shoes', 'fashion', 'accessories', 'watch',
    'phone', 'mobile', 'laptop', 'electronics', 'gadget', 'headphones',
    'earbuds', 'charger', 'case', 'cover', 'bag', 'backpack', 'wallet',
    'perfume', 'cosmetics', 'makeup', 'skincare', 'jewellery', 'gift',
    'decor', 'furniture', 'appliance', 'online',
  ],
  Education: [
    'book', 'books', 'course', 'udemy', 'coursera', 'skillshare',
    'education', 'school', 'college', 'university', 'tuition', 'class',
    'coaching', 'exam', 'test', 'study', 'stationery', 'pen', 'notebook',
    'library', 'notes', 'print', 'photocopy', 'xerox', 'certificate',
    'workshop', 'seminar', 'conference', 'tutorial', 'learning',
  ],
  Health: [
    'doctor', 'hospital', 'clinic', 'medical', 'medicine', 'pharmacy',
    'gym', 'fitness', 'yoga', 'health', 'dental', 'dentist', 'eye',
    'vitamin', 'supplement', 'insurance', 'checkup', 'lab', 'test',
    'therapy', 'physiotherapy', 'mental', 'counseling', 'apollo',
    'practo', 'protein', 'wellness',
  ],
  Bills: [
    'rent', 'electricity', 'water', 'wifi', 'internet', 'broadband',
    'phone bill', 'mobile bill', 'recharge', 'dth', 'gas bill',
    'maintenance', 'emi', 'loan', 'credit card', 'insurance',
  ],
};

/**
 * Categorize an expense based on its name
 * @param {string} expenseName - The name/description of the expense
 * @returns {string} The category name
 */
export function categorizeExpense(expenseName) {
  if (!expenseName) return 'Others';
  
  const lower = expenseName.toLowerCase().trim();
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Others';
}

/**
 * Get a category color
 * @param {string} category - The category name
 * @returns {string} Hex color for the category
 */
export function getCategoryColor(category) {
  const colors = {
    Food: '#F59E0B',
    Transport: '#3B82F6',
    Entertainment: '#8B5CF6',
    Shopping: '#EC4899',
    Education: '#10B981',
    Health: '#EF4444',
    Bills: '#6366F1',
    Others: '#94A3B8',
  };
  return colors[category] || colors.Others;
}

/**
 * Get all available categories
 * @returns {string[]} Array of category names
 */
export function getAllCategories() {
  return [...Object.keys(categories), 'Others'];
}

/**
 * Get a category emoji
 * @param {string} category - The category name
 * @returns {string} Emoji for the category
 */
export function getCategoryEmoji(category) {
  const emojis = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Education: '📚',
    Health: '💊',
    Bills: '📄',
    Others: '📦',
  };
  return emojis[category] || '📦';
}
