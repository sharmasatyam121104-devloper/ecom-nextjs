import { ProductInterface } from "./productDataRes.interface"
import { UserInterface } from "./user.interface"


export interface OrderInterface {
  _id: string
  userId: UserInterface
  productId: ProductInterface
  price: number
  discount: number
  status: "processing" | "dispatched" | "returned" | "deliverd"
  address?: string
  createdAt: string
  updatedAt: string
  __v: number
}

