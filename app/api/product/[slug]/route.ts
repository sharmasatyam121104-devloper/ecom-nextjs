import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import SlugInterface from "@/interfaces/slug-interface";
import ProductModel, { IProduct } from "@/models/product.model";


//Add a new product
export const GET = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug } = await context.params

    const product = await ProductModel.findOne({ slug })

    if (!product) {
      return res.json(
        { error: "Product Not Found" },
        { status: 404 }
      )
    }

    return res.json(product)
  } catch (error) {
    return serverCatchError(error) 
  }
}

//upadte a product by slug as id
export const PUT = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug: id } = await context.params
    const body = await req.json()
    const { title, description, price, discount,quantity } = body

    // Basic validation
    if (!title && !description && !price && discount === undefined && quantity === undefined) {
      return res.json(
        { error: "At least one field (title, description, price, discount,quantity) is required to update" },
        { status: 400 }
      )
    }

    // If price or discount provided, ensure they are numbers
    if ((price && typeof price !== "number") || (discount && typeof discount !== "number") || (quantity !== undefined && typeof quantity !== "number")) {
      return res.json(
        { error: "Price, discount and quantity must be numbers" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: Partial<IProduct> = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (discount !== undefined) updateData.discount = discount
    if (quantity !== undefined) updateData.quantity = quantity


    // Update product
    const product = await ProductModel.findOneAndUpdate(
      { _id: id },     
      updateData,     
      { new: true }   
    )

    if (!product) {
      return res.json(
        { error: "Product Not Found" },
        { status: 404 }
      )
    }

    return res.json(product)
  } 
  catch (error) {
    return serverCatchError(error) 
  }
}

//delte a product by slug as id
export const DELETE = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug: id } = await context.params

    // delte product
    const product = await ProductModel.findOneAndDelete(
      { _id: id }  
    )

    if (!product) {
      return res.json(
        { error: "Product Not Found" },
        { status: 404 }
      )
    }

    return res.json(product)
  } 
  catch (error) {
    return serverCatchError(error) 
  }
}