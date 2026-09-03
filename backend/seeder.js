const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");

const bcrypt = require("bcryptjs");

dotenv.config();


const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        // Admin
        const adminPassword = await bcrypt.hash(
            "admin123",
            10
        );

        await User.create({
            name: "Admin",
            email: "admin@grocery.com",
            password: adminPassword,
            role: "admin"
        });

        // Categories
        const fruits = await Category.create({
            name: "Fruits"
        });

        const vegetables = await Category.create({
            name: "Vegetables"
        });

        const dairy = await Category.create({
            name: "Dairy"
        });

        // Products
        await Product.create([
            {
                name: "Apple",
                description: "Fresh red apples",
                price: 120,
                stock: 50,
                unit: "kg",
                category: fruits._id
            },

            {
                name: "Banana",
                description: "Fresh bananas",
                price: 60,
                stock: 100,
                unit: "dozen",
                category: fruits._id
            },

            {
                name: "Tomato",
                description: "Fresh tomatoes",
                price: 40,
                stock: 80,
                unit: "kg",
                category: vegetables._id
            },

            {
                name: "Milk",
                description: "Fresh milk",
                price: 30,
                stock: 100,
                unit: "litre",
                category: dairy._id
            }
        ]);

        console.log("Data seeded successfully");

        process.exit();

    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};


seedData();