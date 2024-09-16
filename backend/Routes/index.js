import express from 'express';
import categoryRoute from './CategoryRoute.js';
import subcategoryRoute from './SubCategoryRoute.js';
import AuthRoute from './AuthRoute.js';


const router = express.Router();

router.use('/category', categoryRoute);
router.use('/subcategory', subcategoryRoute);
router.use('/auth', AuthRoute);


export default router;
