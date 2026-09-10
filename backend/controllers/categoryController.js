const Category = require("../models/Category");
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


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await category.deleteOne();

        res.json({
            message: "Category deleted"
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
    deleteCategory
};