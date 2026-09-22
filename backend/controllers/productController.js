const Product = require("../models/Product");
// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { keyword, search, category, minPrice, maxPrice, sortBy } = req.query;
        const searchTerm = keyword || search;

        let filter = {};

        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: "i" };
        }

        if (category && category !== "all") {
            const mongoose = require("mongoose");
            if (mongoose.Types.ObjectId.isValid(category)) {
                filter.category = category;
            } else {
                const Category = require("../models/Category");
                const foundCategory = await Category.findOne({
                    $or: [
                        { name: { $regex: `^${category}$`, $options: "i" } },
                        { slug: category.toLowerCase() }
                    ]
                });

                if (foundCategory) {
                    filter.category = foundCategory._id;
                } else {
                    filter.category = category;
                }
            }
        }

        if (minPrice !== undefined && minPrice !== "") {
            filter.price = filter.price || {};
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            filter.price = filter.price || {};
            filter.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sortBy === "price-low") sortOption = { price: 1 };
        if (sortBy === "price-high") sortOption = { price: -1 };
        if (sortBy === "rating") sortOption = { rating: -1 };
        if (sortBy === "popular") sortOption = { numReviews: -1, createdAt: -1 };

        const products = await Product
            .find(filter)
            .populate("category")
            .sort(sortOption);

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const product = await Product
            .findById(req.params.id)
            .populate("category");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// CREATE PRODUCT - ADMIN
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            image,
            category,
            stock,
            unit,
            isOrganic
        } = req.body;

        if (!name || !name.trim() || price === undefined || price === null || !category) {
            return res.status(400).json({
                message: "Please provide product name, price, and category."
            });
        }

        const trimmedName = name.trim();
        if (trimmedName.length < 2 || !/[a-zA-Z]/.test(trimmedName)) {
            return res.status(400).json({
                message: "Product name must contain letters and be at least 2 characters long."
            });
        }

        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({
                message: "Price must be a valid number greater than ₹0."
            });
        }

        if (originalPrice !== undefined && originalPrice !== null && originalPrice !== "") {
            const numOriginal = Number(originalPrice);
            if (isNaN(numOriginal) || numOriginal < numPrice) {
                return res.status(400).json({
                    message: "Original price (MRP) cannot be less than selling price."
                });
            }
        }

        const numStock = Number(stock);
        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({
                message: "Stock quantity cannot be negative."
            });
        }

        const mongoose = require("mongoose");
        let categoryId = mongoose.Types.ObjectId.isValid(category) ? category : null;

        if (!categoryId) {
            const Category = require("../models/Category");
            const firstCat = await Category.findOne({});
            if (firstCat) {
                categoryId = firstCat._id;
            }
        }

        if (!categoryId) {
            return res.status(400).json({
                message: "A valid category is required."
            });
        }

        const product = await Product.create({
            name: trimmedName,
            description: description || "",
            price: numPrice,
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image: image || "",
            category: categoryId,
            stock: isNaN(numStock) ? 0 : numStock,
            unit: unit || "piece",
            isOrganic: Boolean(isOrganic)
        });

        const populatedProduct = await Product.findById(product._id).populate("category");

        res.status(201).json(populatedProduct || product);

    } catch (error) {
        if (error.name === "CastError" || error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};
// UPDATE PRODUCT - ADMIN
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const updateData = { ...req.body };

        if (updateData.name !== undefined) {
            const trimmedName = String(updateData.name).trim();
            if (trimmedName.length < 2 || !/[a-zA-Z]/.test(trimmedName)) {
                return res.status(400).json({
                    message: "Product name must contain letters and be at least 2 characters long."
                });
            }
            updateData.name = trimmedName;
        }

        if (updateData.price !== undefined) {
            const numPrice = Number(updateData.price);
            if (isNaN(numPrice) || numPrice <= 0) {
                return res.status(400).json({
                    message: "Price must be a valid number greater than ₹0."
                });
            }
            updateData.price = numPrice;
        }

        if (updateData.originalPrice !== undefined && updateData.originalPrice !== null && updateData.originalPrice !== "") {
            const numOriginal = Number(updateData.originalPrice);
            const currentPrice = updateData.price !== undefined ? updateData.price : product.price;
            if (isNaN(numOriginal) || numOriginal < currentPrice) {
                return res.status(400).json({
                    message: "Original price (MRP) cannot be less than selling price."
                });
            }
            updateData.originalPrice = numOriginal;
        }

        if (updateData.stock !== undefined) {
            const numStock = Number(updateData.stock);
            if (isNaN(numStock) || numStock < 0) {
                return res.status(400).json({
                    message: "Stock quantity cannot be negative."
                });
            }
            updateData.stock = numStock;
        }

        if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
            delete updateData.category;
        }

        Object.assign(product, updateData);

        const updatedProduct = await product.save();
        const populatedProduct = await Product.findById(updatedProduct._id).populate("category");

        res.json(populatedProduct || updatedProduct);

    } catch (error) {
        if (error.name === "CastError" || error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};
// DELETE PRODUCT - ADMIN
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};