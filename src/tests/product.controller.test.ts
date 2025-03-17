import request from 'supertest';
import mongoose, { Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Product, { IProduct } from '../models/product.model';

interface IProductDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
}

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Configure Mongoose
  mongoose.set('strictQuery', false);
  
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 10000);

afterAll(async () => {
  // Clean up
  await mongoose.disconnect();
  await mongoServer.stop();
}, 10000);

beforeEach(async () => {
  // Clear database before each test
  await Product.deleteMany({});
});

describe('Product Controller Tests', () => {
  const sampleProduct = {
    name: 'Test iPhone',
    description: 'A test product',
    price: 999.99,
    category: 'Smartphones',
    inStock: true,
    quantity: 50
  };

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(sampleProduct);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(sampleProduct.name);
    });

    it('should fail to create product with invalid data', async () => {
      const invalidProduct = { name: '' };
      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Add test products
      await Product.create([
        sampleProduct,
        {
          name: 'Test MacBook',
          description: 'High-end laptop with M1 chip',
          price: 1499.99,
          category: 'Computers',
          inStock: true,
          quantity: 30
        },
        {
          name: 'Test AirPods',
          description: 'Wireless earbuds',
          price: 199.99,
          category: 'Electronics',
          inStock: false,
          quantity: 0
        }
      ]);
    });

    it('should get all products', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ category: 'Smartphones' });

      expect(response.status).toBe(200);
      expect(response.body.results).toBe(1);
      expect(response.body.data[0].category).toBe('Smartphones');
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ minPrice: 1000, maxPrice: 2000 });

      expect(response.status).toBe(200);
      expect(response.body.results).toBe(1);
      expect(response.body.data[0].name).toBe('Test MacBook');
    });

    it('should filter products by stock status', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ inStock: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.results).toBe(2);
    });

    it('should filter products by name search', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ name: 'MacBook' });

      expect(response.status).toBe(200);
      expect(response.body.results).toBe(1);
      expect(response.body.data[0].name).toBe('Test MacBook');
    });

    it('should filter products by description search', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ description: 'chip' });

      expect(response.status).toBe(200);
      expect(response.body.results).toBe(1);
      expect(response.body.data[0].name).toBe('Test MacBook');
    });
  });

  describe('GET /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const doc = await Product.create(sampleProduct);
      const product = doc.toObject() as IProductDocument;
      productId = product._id.toString();
    });

    it('should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(sampleProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const doc = await Product.create(sampleProduct);
      const product = doc.toObject() as IProductDocument;
      productId = product._id.toString();
    });

    it('should update product', async () => {
      const updateData = {
        name: 'Updated iPhone',
        price: 1099.99
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const doc = await Product.create(sampleProduct);
      const product = doc.toObject() as IProductDocument;
      productId = product._id.toString();
    });

    it('should delete product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`);

      expect(response.status).toBe(204);

      // Verify product is deleted
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/products/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });
});