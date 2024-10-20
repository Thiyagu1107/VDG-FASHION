import express from 'express';
import multer from 'multer';
import { createSliderController, deleteSliderController, sliderController } from '../Controllers/SliderController.js';
import { isAdmin, requireSignIn } from '../Middleware/AuthMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post('/', requireSignIn, isAdmin, upload.single('image'), createSliderController);
router.get('/', sliderController);
router.delete('/:id', requireSignIn, isAdmin, deleteSliderController);

export default router;
