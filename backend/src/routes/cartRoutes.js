import { Router } from 'express';
import { addToCart, getCartItems, removeCartItem, updateCartQuantity } from '../controllers/cartController.js';

const router = Router();

router.get('/', getCartItems);
router.post('/', addToCart);
router.patch('/:id', updateCartQuantity);
router.delete('/:id', removeCartItem);

export default router;
