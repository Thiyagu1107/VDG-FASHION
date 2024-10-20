import express from 'express';
import categoryRoute from './CategoryRoute.js';
import subcategoryRoute from './SubCategoryRoute.js';
import AuthRoute from './AuthRoute.js';
import ProductRoute from "./productRoute.js";
import SliderRoute from "./SliderRoutes.js";

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/slider', SliderRoute);
router.use('/category', categoryRoute);
router.use('/subcategory', subcategoryRoute);
router.use('/product', ProductRoute);




export default router;
