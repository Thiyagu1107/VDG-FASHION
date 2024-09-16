import categoryModel from "../Models/CategoryModel.js";


export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: 'Category already exists',
            });
        }
        
        const category = new categoryModel({ name });
        await category.save();
        
        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while creating the category',
            error: error.message,
        });
    }
};


export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        
        if (!name) {
            return res.status(400).send({ message: 'Name is required for update' });
        }
        
        const category = await categoryModel.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while updating the category',
            error: error.message,
        });
    }
};


export const categoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All categories retrieved successfully',
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while retrieving categories',
            error: error.message,
        });
    }
};


export const singleCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Category retrieved successfully',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while retrieving the category',
            error: error.message,
        });
    }
};


export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while deleting the category',
            error: error.message,
        });
    }
};
