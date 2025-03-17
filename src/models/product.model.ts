import mongoose, { Document, Schema } from 'mongoose';

// Product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product schema
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create and export Product model
export default mongoose.model<IProduct>('Product', ProductSchema); 