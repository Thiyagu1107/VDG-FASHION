import express from 'express';
import multer from 'multer';
import { createProductController, deleteProductController, productController, productControlleruser, singleProductController, updateProductController } from '../Controllers/ProductController.js';
import { isAdmin, requireSignIn } from '../Middleware/AuthMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post('/', requireSignIn, isAdmin, upload.single('image'), createProductController);
router.put('/:id', requireSignIn, isAdmin, upload.single('image'), updateProductController);
router.get('/all', productController);
router.get('/', productControlleruser);
router.get('/:id', singleProductController);
router.delete('/:id', requireSignIn, isAdmin, deleteProductController);

export default router;
