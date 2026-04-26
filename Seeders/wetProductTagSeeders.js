const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');
const ProductsTag = require('../models/ProductTagModel');
console.log(process.env.MONGO_URI)
const MONGO_URI = `mongodb+srv://khrahat92:1ZP6L8yY7fagaXwj@cluster0.c8qwi24.mongodb.net/mealManagement` || "mongodb://127.0.0.1:27017/your_db";

// 👉 Your Category ObjectId
const CATEGORY_ID = "6992c633d4a0377f0dc1fffa";

// 👉 Seeder Data (Wet Products)
const tags = [
  { name: "Onion (পেঁয়াজ)", bnName: "Peyaj" },
  { name: "Garlic (রসুন)", bnName: "Roshun" },
  { name: "Ginger (আদা)", bnName: "Ada" },
  { name: "Tomato (টমেটো)", bnName: "Tomato" },
  { name: "Brinjal (বেগুন)", bnName: "Begun" },
  { name: "Green Chili (কাঁচা মরিচ)", bnName: "Kacha Morich" },
  { name: "Cucumber (শসা)", bnName: "Shosha" },
  { name: "Carrot (গাজর)", bnName: "Gajor" },
  { name: "Spinach (পালং শাক)", bnName: "Palong Shak" },
  { name: "Cabbage (বাঁধাকপি)", bnName: "Bandhakopi" },
  { name: "Cauliflower (ফুলকপি)", bnName: "Phulkopi" },
  { name: "Pumpkin (কুমড়া)", bnName: "Kumra" },
  { name: "Pointed Gourd (পটল)", bnName: "Potol" },
  { name: "Bitter Gourd (করলা)", bnName: "Korola" },
  { name: "Snake Gourd (চিচিঙ্গা)", bnName: "Chichinga" },
];

async function seedProductTags() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // // Optional: clear existing tags for this category
    // await ProductsTag.deleteMany({ category: CATEGORY_ID });

    const formattedTags = tags.map(tag => ({
      ...tag,
      category: CATEGORY_ID
    }));

    await ProductsTag.insertMany(formattedTags);

    console.log("🌱 Product Tags Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error.message);
    process.exit(1);
  }
}

seedProductTags();