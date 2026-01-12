import { OrderInterface } from "./orderData.interface"
import { UserInterface } from "./user.interface"

export interface PaymentInterface {
  _id: string
  userId: UserInterface
  orderId: OrderInterface
  paymentId: string
  vendor: 'razorpay' | 'stripe' | 'paypal'
  createdAt: string
  updatedAt: string
  __v: number
}