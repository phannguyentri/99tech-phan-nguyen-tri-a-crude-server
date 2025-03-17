import { Request, Response } from 'express';
import Product, { IProduct } from '../models/product.model';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    // Create new product
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    // Return success response
    return res.status(201).json({
      status: 'success',
      data: savedProduct
    });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: messages
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Get all products with filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      inStock,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      name,
      description,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by stock status
    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }
    
    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    
    // Filter by quantity range
    if (minQuantity !== undefined || maxQuantity !== undefined) {
      filter.quantity = {};
      
      if (minQuantity !== undefined) {
        filter.quantity.$gte = Number(minQuantity);
      }
      
      if (maxQuantity !== undefined) {
        filter.quantity.$lte = Number(maxQuantity);
      }
    }
    
    // Filter by name (case-insensitive partial match)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Filter by description (case-insensitive partial match)
    if (description) {
      filter.description = { $regex: description, $options: 'i' };
    }
    
    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Return success response
    return res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error: any) {
    // Handle errors
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find product by ID
    const product = await Product.findById(id);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Return success response
    return res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    // Handle invalid ID error
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Return success response
    return res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: messages
      });
    }
    
    // Handle invalid ID error
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find and delete product
    const product = await Product.findByIdAndDelete(id);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Return success response (no content)
    return res.status(204).send();
  } catch (error: any) {
    // Handle invalid ID error
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error.message
    });
  }
}; 