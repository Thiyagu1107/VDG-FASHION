import express  from 'express';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../Controllers/CategoryController.js';
import { isAdmin, requireSignIn } from '../Middleware/AuthMiddleware.js';


const router = express.Router();

router.post('/', requireSignIn, isAdmin, createCategoryController);
router.put('/:id',requireSignIn, isAdmin, updateCategoryController);
router.get('/', categoryController);
router.get('/:id', singleCategoryController);
router.delete(':id',requireSignIn, isAdmin, deleteCategoryController);



export default router;
