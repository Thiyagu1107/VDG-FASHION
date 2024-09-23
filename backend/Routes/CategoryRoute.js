import express from 'express';
import multer from 'multer';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../Controllers/CategoryController.js';
import { isAdmin, requireSignIn } from '../Middleware/AuthMiddleware.js';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Adjust storage as needed


router.post('/', requireSignIn, isAdmin, upload.single('image'), createCategoryController);
router.put('/:id', requireSignIn, isAdmin, upload.single('image'), updateCategoryController);
router.get('/', categoryController);
router.get('/:id', singleCategoryController);
router.delete('/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;
