import Slider from '../Models/SliderModel.js';
import { deleteImageFromDrive, uploadImageToDrive } from '../Helpers/imageUpload.js';
import multer from 'multer';

const storage = multer.memoryStorage();

// Create a new slider image
export const createSliderController = async (req, res) => {
    let imageUrl;

    try {
        const folderId = "1y5_3QzDqaHIaAxLKiu8PF0RcaAkek8WY";

        if (!req.file) {
            return res.status(400).send({ message: 'Image file is required' });
        }

        imageUrl = await uploadImageToDrive(req.file.buffer, req.file.originalname, req.file.mimetype, folderId);

        const slider = new Slider({ imageUrl });
        await slider.save();

        res.status(201).send({
            success: true,
            message: 'New slider image created',
            slider,
        });
    } catch (error) {
        console.error('Error while creating slider:', error.message);
        
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
            message: 'An error occurred while creating the slider image',
            error: error.message,
        });
    }
};

// Get all slider images
export const sliderController = async (req, res) => {
    try {
        const sliders = await Slider.find({});
        res.status(200).send({
            success: true,
            message: 'All slider images retrieved successfully',
            sliders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while retrieving slider images',
            error: error.message,
        });
    }
};

// Delete a slider image
export const deleteSliderController = async (req, res) => {
    try {
        const { id } = req.params;

        const slider = await Slider.findById(id);
        if (!slider) {
            return res.status(404).send({ success: false, message: 'Slider image not found' });
        }

        if (slider.imageUrl) {
            try {
                await deleteImageFromDrive(slider.imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image from Drive:', deleteError.message);
            }
        }

        await Slider.findByIdAndDelete(id);
        
        res.status(200).send({
            success: true,
            message: 'Slider image deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting slider image:', error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while deleting the slider image',
            error: error.message,
        });
    }
};
