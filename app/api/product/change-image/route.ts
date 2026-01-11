const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import { writeFileSync } from "fs";
import path from "path";
import { v4 as uuid } from 'uuid'
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

//update image of product
export const PUT = async(req: NextRequest)=>{
    try {
        //protected api 
        const session = await getServerSession(authOptions)
        if(!session) {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        if(session.user.role !== "admin") {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
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