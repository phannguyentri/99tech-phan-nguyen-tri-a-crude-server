# CRUD Server with MongoDB and Express

A RESTful CRUD API server built with MongoDB, Express, and TypeScript, following MVC architecture.

## Features

- RESTful API endpoints for product management
- MongoDB integration with Mongoose ODM
- TypeScript for type safety
- Docker containerization
- Automatic database seeding with sample data
- Comprehensive filtering system
- Unit testing with Jest and Supertest

## Tech Stack

- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- Docker & Docker Compose
- Jest & Supertest for testing

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v16 or later)
- npm

### Installation

1. Clone the repository
2. Run with Docker:
   ```bash
   docker-compose up --build
   ```
   The server will start at http://localhost:3000

### Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://mongodb:27017/product-db)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

### Products

- `GET /api/products`: Get all products with filtering options
  - Query parameters:
    - `category`: Filter by category
    - `minPrice`/`maxPrice`: Filter by price range
    - `inStock`: Filter by stock status
    - `name`: Search by product name
    - `description`: Search by product description
    - `page`: Page number for pagination
    - `limit`: Items per page
    - `sortBy`: Field to sort by
    - `sortOrder`: Sort order (asc/desc)

- `POST /api/products`: Create a new product
- `GET /api/products/:id`: Get a product by ID
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Testing

The project includes comprehensive unit tests using Jest and Supertest. The tests cover all CRUD operations and filtering functionality.

### Test Coverage

- **Product Creation**
  - Creating products with valid data
  - Handling invalid product data

- **Product Retrieval**
  - Getting all products with pagination
  - Filtering products by:
    - Category
    - Price range
    - Stock status
    - Name search
    - Description search

- **Product Updates**
  - Updating existing products
  - Handling non-existent products

- **Product Deletion**
  - Deleting products
  - Handling non-existent products

### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Environment

- Uses `mongodb-memory-server` for isolated testing
- Automatically sets up and tears down test database
- Independent test suites for each endpoint
- Mocked data for consistent testing

## Sample Data

When the application starts with an empty database, it will be seeded with sample products including:
- iPhone 15 Pro
- MacBook Pro 16
- iPhone 13 Pro

## Error Handling

The API includes comprehensive error handling for:
- Invalid requests
- Non-existent resources
- Validation errors
- Database errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.