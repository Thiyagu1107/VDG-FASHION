import multer from 'multer';
import Category from '../Models/CategoryModel.js';
import { deleteImageFromDrive, uploadImageToDrive } from '../Helpers/imageUpload.js';

const storage = multer.memoryStorage();

export const createCategoryController = async (req, res) => {
    let imageUrl; // Define imageUrl at the beginning

    try {
        const folderId = "1C_9JuIhi3HHBHDwyxmAPJ3nfTthpcCzT";
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: 'Category already exists',
            });
        }

        // Only upload the image if a file is provided
        if (req.file) {
            try {
                imageUrl = await uploadImageToDrive(req.file.buffer, req.file.originalname, req.file.mimetype, folderId);
            } catch (uploadError) {
                return res.status(500).send({
                    success: false,
                    message: 'An error occurred while uploading the image',
                    error: uploadError.message,
                });
            }
        }

        // Create category with imageUrl if no errors occurred
        const category = new Category({ name, imageUrl });
        await category.save();

        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.error('Error while creating category:', error.message);
        
        // Delete uploaded image from Drive if it exists
        if (imageUrl) {
            try {
                await deleteImageFromDrive(imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError.message);
            }
        }

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

        // Fetch the current category to get the existing imageUrl
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        const categoryData = { name };

        // Check if a new file is provided
        if (req.file) {
            // Delete the old image from Google Drive
            if (category.imageUrl) {
                try {
                    await deleteImageFromDrive(category.imageUrl);
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError.message);
                    return res.status(500).send({ success: false, message: 'Failed to delete old image' });
                }

                // Upload the new image to Google Drive
                const imageUrl = await uploadImageToDrive(req.file.buffer, req.file.originalname, req.file.mimetype, folderId);
                categoryData.imageUrl = imageUrl; // Update the new imageUrl
            }
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    } catch (error) {
        console.error('Error while updating category:', error);
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


export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the category to get the imageUrl before deleting
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        // Delete the associated image from Google Drive if it exists
        if (category.imageUrl) {
            try {
                await deleteImageFromDrive(category.imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image from Drive:', deleteError.message);
                // Continue with category deletion even if image deletion fails
            }
        }

        // Now delete the category
        await Category.findByIdAndDelete(id);
        
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting category:', error);
        res.status(500).send({ success: false, message: 'An error occurred while deleting the category', error: error.message });
    }
};
