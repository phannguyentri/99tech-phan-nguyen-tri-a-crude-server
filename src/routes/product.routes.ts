import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

const router = Router();

// Create a new product
router.post('/', createProduct);

// Get all products with filters
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

export default router; 