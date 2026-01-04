import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import { writeFileSync } from "fs";
import path from "path";
import { v4 as uuid } from 'uuid'

//Add a new product
export const POST = async(req: NextRequest)=>{
    try {
        const formData = await req.formData()

        // Basic validation
        const title = formData.get("title")?.toString() || ""
        const description = formData.get("description")?.toString() || ""
        const price = Number(formData.get("price"))
        const discount = Number(formData.get("discount") || 0)
        const file = formData.get("image") as File | null

        if (!file) {
            return res.json(
                { error: "Images are required" },
                { status: 400 }
            )
        }

        if (!title || !description || price === undefined) {
            return res.json(
                { error: "Title, description, and price are required" },
                { status: 400 }
            )
        }

        if (typeof title !== "string" || typeof description !== "string") {
            return res.json(
                { error: "Title and description must be strings" },
                { status: 400 }
            )
        }

        if (typeof price !== "number" || (discount && typeof discount !== "number")) {
            return res.json(
                { error: "Price and discount must be numbers" },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${uuid()}.png`
        const root = process.cwd()
        const folder = path.join(root, "public","products")
        const filePath = path.join(folder,fileName)
        writeFileSync(filePath,buffer)


        const productData = {
        title,
        description,
        price,
        discount: discount || 0,
        image: `/products/${fileName}`
        }

        const product = await ProductModel.create(productData)

        return res.json({product})
    } 
    catch (error) {
        return serverCatchError(error)
    }
}

//Fetch all products

export const GET = async(req: NextRequest)=>{
    try {
        const {searchParams} = new URL(req.url)
        const slug = searchParams.get("slug")

        if(slug) {
            const slugs = await ProductModel.distinct('slug')
            return res.json({slugs})
        }
        const products = await ProductModel.find()

        return res.json({products})
    } 
    catch (error) {
        return serverCatchError(error)
    }
}