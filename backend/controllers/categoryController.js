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
        const { name, image } = req.body;

        const category = await Category.create({
            name,
            image
        });

        res.status(201).json(category);

    } catch (error) {
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