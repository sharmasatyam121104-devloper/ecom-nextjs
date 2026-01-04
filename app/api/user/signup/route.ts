import mongoose from "mongoose";
mongoose.connect(process.env.DB!);

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse as res } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { fullname, email, password } = await req.json();

    // validation
    if (!fullname || !email || !password) {
      return res.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return res.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Create user
    await UserModel.create({ fullname, email, password });

    return res.json({ message: "Signup success" });
  } 
  catch (error) {
    return serverCatchError(error);
  }
};
