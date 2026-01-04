import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  discount?: number;
  slug?:string
  image:string
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.pre('save',function(){
  this.slug = this.title.toLowerCase().split(" ").join("-")
})

const ProductModel = models.Product || model<IProduct>("Product", productSchema);

export default ProductModel;
