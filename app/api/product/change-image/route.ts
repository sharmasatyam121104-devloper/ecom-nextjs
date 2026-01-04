import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import { writeFileSync } from "fs";
import path from "path";
import { v4 as uuid } from 'uuid'

//Add a new product
export const PUT = async(req: NextRequest)=>{
    try {
        const formData = await req.formData()

        // Basic validation
        const id = formData.get("id") as string
        const file = formData.get("image") as File | null

        if (!file) {
            return res.json(
                { error: "Images are required" },
                { status: 400 }
            )
        }

        if (!id) {
            return res.json(
                { error: "Images are required" },
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


        await ProductModel.findByIdAndUpdate(id,{$set:{image: `/products/${fileName}`}})

        return res.json({message:'Image changed.!'})
    } 
    catch (error) {
        return serverCatchError(error)
    }
}