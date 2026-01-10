import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

// User document interface
export interface IUser extends mongoose.Document {
  fullname: string;
  email: string;
  password: string;
  role: string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type:String
    },
  },
  { timestamps: true }
);

// Forcing every user save as user
userSchema.pre("save", function () {
  this.role = "user";
});


// Hash password before save 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  this.password = await bcrypt.hash(this.password, 12);
});

// Password compare method (Login)
userSchema.methods.comparePassword = function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = models.User || model<IUser>("User", userSchema);

export default UserModel;
