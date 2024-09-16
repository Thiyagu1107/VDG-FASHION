import express  from 'express';
import { createSubCategoryController, deleteSubCategoryController, singleSubCategoryController, SubcategoryController, updateSubCategoryController } from '../Controllers/SubCategoryController.js';
import { isAdmin, requireSignIn } from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/', requireSignIn, isAdmin, createSubCategoryController);
router.put('/:id',requireSignIn, isAdmin, updateSubCategoryController);
router.get('/', SubcategoryController);
router.get('/:id', singleSubCategoryController);
router.delete(':id', requireSignIn, isAdmin, deleteSubCategoryController);



export default router;
