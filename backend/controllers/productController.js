const Product = require("../models/Product");
// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const filter = keyword
            ? {
                name: {
                    $regex: keyword,
                    $options: "i"
                }
            }
            : {};

        const products = await Product
            .find(filter)
            .populate("category");

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
            image,
            category,
            stock,
            unit
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock,
            unit
        });

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// UPDATE PRODUCT - ADMIN
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        Object.assign(product, req.body);

        const updatedProduct = await product.save();

        res.json(updatedProduct);

    } catch (error) {
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