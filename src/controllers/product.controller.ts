import { Request, Response } from 'express';
import Product from '../models/product.model';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    return res.status(400).json({
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
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error.message
    });
  }
}; 