import multer from 'multer';
import Category from '../Models/CategoryModel.js';
import { uploadImageToDrive } from '../Helpers/imageUpload.js';

const storage = multer.memoryStorage();

export const createCategoryController = async (req, res) => {
    try {
        const folderId = "1C_9JuIhi3HHBHDwyxmAPJ3nfTthpcCzT";
        const { name } = req.body;
        const file = req.file;

        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }

        const imageUrl = await uploadImageToDrive(file.buffer, file.originalname, file.mimetype, folderId);

        // Create category with imageUrl
        const category = new Category({ name, imageUrl });
        await category.save();

        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.error('Error while creating category:', error.message);
        res.status(500).send({
            success: false,
            message: 'An error occurred while creating the category',
            error: error.message,
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const folderId = "1C_9JuIhi3HHBHDwyxmAPJ3nfTthpcCzT";
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(400).send({ message: 'Name is required for update' });
        }

        const categoryData = { name };
        if (req.file) {
            const imageUrl = await uploadImageToDrive(req.file.buffer, req.file.originalname, req.file.mimetype, folderId);
            categoryData.imageUrl = imageUrl;
        }

        const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred while updating the category', error: error.message });
    }
};

// Get all categories
export const categoryController = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).send({
            success: true,
            message: 'All categories retrieved successfully',
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred while retrieving categories', error: error.message });
    }
};

// Get single category
export const singleCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Category retrieved successfully',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred while retrieving the category', error: error.message });
    }
};

// Delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred while deleting the category', error: error.message });
    }
};
