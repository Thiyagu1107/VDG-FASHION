import subcategoryModel from "../Models/SubcategoryModel.js";


export const createSubCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        
        const existingCategory = await subcategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: 'Sub-Category already exists',
            });
        }
        
        const category = new subcategoryModel({ name });
        await category.save();
        
        res.status(201).send({
            success: true,
            message: 'New Sub-category created',
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


export const updateSubCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        
        if (!name) {
            return res.status(400).send({ message: 'Name is required for update' });
        }
        
        const category = await subcategoryModel.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Sub-Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Sub-Category updated successfully',
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


export const SubcategoryController = async (req, res) => {
    try {
        const categories = await subcategoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Sub-categories retrieved successfully',
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


export const singleSubCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await subcategoryModel.findById(id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Sub-Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Sub-Category retrieved successfully',
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


export const deleteSubCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await subcategoryModel.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Sub-Category not found',
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Sub-Category deleted successfully',
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
