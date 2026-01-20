'use client'

import clientCatchError from "@/lib/client-catch-error"
import axios from "axios"
import { Button, message } from "antd"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { useSession } from "next-auth/react"
import { FC } from "react"
import { useRouter } from 'next/navigation'

interface OrderPayInterface {
    productId: string
    price: number
    discount: number
    quantity: number,
}


type RazorpayPaymentResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayPaymentErrorResponse = {
  code: string
  description: string
  source: string
  step: string
  reason: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any
}

// Razorpay notes interface
interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes: any
}
interface PayInterface {
  amount: number
  orders: OrderPayInterface[]
  onSuccess?: (payload: RazorpayPaymentResponse) => void
  onFailed?: (payload: RazorpayPaymentErrorResponse) => void
}

const Pay: FC<PayInterface> = ({ amount, orders, onSuccess, onFailed }) => {
  const { Razorpay } = useRazorpay()
  const session = useSession()
  const router = useRouter()


  // Checkout handler
  const handleCheckOut = async () => {
    try {
      if (!amount || amount <= 0) throw new Error("Invalid amount!")

        if(!session) {
          return router.push('/login')
        }

        if(session.data?.user.role !== "user") {
          return router.push('/login')
        }
            
        if(!session.data.user.address?.pincode) {
          router.push('/user/settings')
          message.warning("Please Provide Address.")
          return
        }

      // Create Razorpay order from backend
      const { data } = await axios.post('/api/razorpay/order', { amount })

        // Transform orders into Razorpay notes format
        const ordersArray = Array.isArray(orders) ? orders : [orders]

        const ordersPayload = {
          productIds: ordersArray.map(o => typeof o.productId === 'object' ? o.productId : o.productId),
          prices: ordersArray.map(o => o.price),
          discounts: ordersArray.map(o => o.discount || 0),
          quantity : ordersArray.map(o=> o.quantity)
        }
        console.log("ORDERS PAYLOAD:", ordersPayload)

      const options: ModifiedRazorpayInterface = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        name: "Ecom Shops",
        description: "Order Payment",
        order_id: data.id,
        amount: data.amount,
        currency: 'INR',
        prefill: {
          name: session.data?.user.name || '',
          email: session.data?.user.email || '',
        },
        notes: {
          userId: session.data?.user.id,
          orders: JSON.stringify(ordersPayload)
        },
        handler: (response) => {
          if (onSuccess) {
            onSuccess(response)
            router.push('/user/orders')
          }
        }
      }

      const rzp = new Razorpay(options)
      rzp.open()

      rzp.on("payment.failed", (payload) => {
        if (onFailed) onFailed(payload as unknown as RazorpayPaymentErrorResponse)
      })

    } catch (error) {
      clientCatchError(error)
    }
  }

  return (
    <div>
      <Button
        type="primary"
        size="large"
        className="bg-green-500! hover:bg-green-400! w-full!"
        onClick={handleCheckOut}
      >
        Checkout
      </Button>
    </div>
  )
}

export default Pay
