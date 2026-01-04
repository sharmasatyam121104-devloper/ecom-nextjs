import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

// User document interface
export interface IUser extends mongoose.Document {
  fullname: string;
  email: string;
  password: string;
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
    }
  },
  { timestamps: true }
);

// Hash password before save (TypeScript safe)
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
