# A Crude Server - Product API

A CRUD API server for products using Express, TypeScript, and MongoDB.

## Features

- RESTful API with Express.js and TypeScript
- MongoDB database integration with Mongoose
- Docker and Docker Compose setup for easy development and deployment
- Complete CRUD operations for products
- Filtering, sorting, and pagination for product listing
- Error handling and validation
- MVC architecture
- Automatic database seeding with sample data

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crude-server
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up
   ```

   This will start both the Node.js application and MongoDB in separate containers.
   The database will be automatically seeded with sample products if it's empty.

3. The API will be available at http://localhost:3000

### Manual Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crude-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/product-db
   ```

4. Make sure MongoDB is running locally or update the MONGODB_URI in the .env file.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. For production, build and start:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Products

- **Create a product**
  - `POST /api/products`
  - Request body: Product object

- **Get all products**
  - `GET /api/products`
  - Query parameters:
    - `category`: Filter by category
    - `inStock`: Filter by availability (true/false)
    - `minPrice`: Filter by minimum price
    - `maxPrice`: Filter by maximum price
    - `sortBy`: Field to sort by (default: createdAt)
    - `sortOrder`: Sort order (asc/desc, default: desc)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)

- **Get a product by ID**
  - `GET /api/products/:id`

- **Update a product**
  - `PUT /api/products/:id`
  - Request body: Updated product object

- **Delete a product**
  - `DELETE /api/products/:id`

## Product Model

```typescript
{
  name: string;         // Product name (required)
  description: string;  // Product description (required)
  price: number;        // Product price (required, non-negative)
  category: string;     // Product category (required)
  inStock: boolean;     // Availability status (default: true)
  quantity: number;     // Available quantity (required, non-negative, default: 0)
  createdAt: Date;      // Creation timestamp (auto-generated)
  updatedAt: Date;      // Last update timestamp (auto-generated)
}
```

## Sample Data

The application automatically seeds the database with sample products if it's empty. The sample data includes:

- iPhone 13 Pro (Electronics)
- Samsung Galaxy S22 (Electronics)
- MacBook Pro 16 (Computers)
- Dell XPS 15 (Computers)
- Sony WH-1000XM4 (Audio)

## Development

- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Run in production mode: `npm start`

## Docker Commands

- Start containers: `docker-compose up`
- Start in detached mode: `docker-compose up -d`
- Stop containers: `docker-compose down`
- Rebuild containers: `docker-compose up --build`
- Reset database: `docker-compose down -v` (removes volumes)

## License

ISC