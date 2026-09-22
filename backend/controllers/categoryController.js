const Category = require("../models/Category");
const Product = require("../models/Product");

// GET CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.json(categories);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, image, description, slug } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const trimmedName = name.trim();
        const generatedSlug = slug || trimmedName.toLowerCase().replace(/\s+/g, "-");

        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, "i") } });
        if (existing) {
            return res.status(400).json({
                message: "Category with this name already exists"
            });
        }

        const category = await Category.create({
            name: trimmedName,
            slug: generatedSlug,
            description: description || "",
            image: image || ""
        });

        res.status(201).json(category);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Category with this name already exists"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, slug, image } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (name && name.trim()) {
            const trimmedName = name.trim();
            if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
                const existing = await Category.findOne({
                    _id: { $ne: id },
                    name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
                });
                if (existing) {
                    return res.status(400).json({
                        message: "Category with this name already exists"
                    });
                }
            }
            category.name = trimmedName;
            category.slug = slug && slug.trim() ? slug.trim().toLowerCase().replace(/\s+/g, "-") : trimmedName.toLowerCase().replace(/\s+/g, "-");
        } else if (slug && slug.trim()) {
            category.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        if (image !== undefined) {
            category.image = image;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Category with this name already exists"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Safety check: check if products belong to this category
        const productCount = await Product.countDocuments({
            category: category._id
        });

        if (productCount > 0) {
            return res.status(400).json({
                message: "Cannot delete this category because products are associated with it."
            });
        }

        await category.deleteOne();

        res.json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};