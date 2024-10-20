import multer from 'multer';
import Product from '../Models/ProductModel.js';
import { deleteImageFromDrive, uploadImageToDrive } from '../Helpers/imageUpload.js';

const storage = multer.memoryStorage();


export const createProductController = async (req, res) => {
    let imageUrl;

    try {
        const folderId = "1H-s0TX-oYdEuZeoRMB5QuyulSuSeP4fc";
        const { name, description, price, category, subcategory, quantity, shipping, gender,saleprice } = req.body;

        if (!name || !description || !price || !category || !subcategory || !quantity || !gender) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const existingCategory = await Product.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: 'Product already exists',
            });
        }

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

        const product = new Product({ name, description, price, category, subcategory, quantity, imageUrl, shipping, gender, saleprice });
        await product.save();

        res.status(201).send({
            success: true,
            message: 'New product created',
            product,
        });
    } catch (error) {
        console.error('Error while creating product:', error.message);
        
        if (imageUrl) {
            try {
                await deleteImageFromDrive(imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError.message);
            }
        }

        res.status(500).send({
            success: false,
            message: 'An error occurred while creating the product',
            error: error.message,
        });
    }
};

// Update a product
export const updateProductController = async (req, res) => {
    try {
        const folderId = "1H-s0TX-oYdEuZeoRMB5QuyulSuSeP4fc";
        const { id } = req.params;
        const { name, description, price, category, subcategory, quantity, shipping, isactive, gender, saleprice } = req.body;

        if (!name || !description || !price || !category || !subcategory || !quantity) {
            return res.status(400).send({ message: 'All fields are required for update' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        const productData = { name, description, price, category, subcategory, quantity, shipping, isactive, gender, saleprice };

        if (req.file) {
            if (product.imageUrl) {
                try {
                    await deleteImageFromDrive(product.imageUrl);
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError.message);
                    return res.status(500).send({ success: false, message: 'Failed to delete old image' });
                }

                const imageUrl = await uploadImageToDrive(req.file.buffer, req.file.originalname, req.file.mimetype, folderId);
                productData.imageUrl = imageUrl; 
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error while updating product:', error);
        res.status(500).send({ success: false, message: 'An error occurred while updating the product', error: error.message });
    }
};

// Get all products

export const productController = async (req, res) => {
    try {
        const products = await Product.find({}); 
        res.status(200).send({
            success: true,
            message: 'All active products retrieved successfully',
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while retrieving products',
            error: error.message
        });
    }
};
export const productControlleruser = async (req, res) => {
    try {
        const products = await Product.find({ isactive: true }); 
        res.status(200).send({
            success: true,
            message: 'All active products retrieved successfully',
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while retrieving products',
            error: error.message
        });
    }
};

// Get single product
export const singleProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Product retrieved successfully',
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred while retrieving the product', error: error.message });
    }
};

// Delete a product
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        if (product.imageUrl) {
            try {
                await deleteImageFromDrive(product.imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image from Drive:', deleteError.message);
            }
        }

        await Product.findByIdAndDelete(id);
        
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting product:', error);
        res.status(500).send({ success: false, message: 'An error occurred while deleting the product', error: error.message });
    }
};
