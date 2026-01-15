import { ProductInterface } from "./productDataRes.interface";
import { UserInterface } from "./user.interface";

export interface CartInterface {
  _id: string;
  userId: UserInterface;
  productId: ProductInterface;
  qauantity: number; 
  createdAt: Date;
  updatedAt: Date;
}
