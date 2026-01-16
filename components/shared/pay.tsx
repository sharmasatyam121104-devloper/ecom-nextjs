'use client'
import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher"

import { Button, Empty, Result, Skeleton } from "antd";
import axios from "axios";
import Link from "next/link";

import useSWR from "swr"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes: any
}

interface PayInterface {
    amount: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (payload: any)=>void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFailed?: (payload: any)=>void
}

const Pay: FC<PayInterface>= ({amount, onSuccess, onFailed}) => {
  const {data, error, isLoading} = useSWR('/api/cart', fetcher)
  const { Razorpay } = useRazorpay();
  const session = useSession()


  const getOrderPayload = ()=>{
    const productIds = []
    const prices = []
    const discounts = []

    for(const item of data) {
      productIds.push(item.productId._id)
      prices.push(item.productId.price)
      discounts.push(item.productId.discount)
    }

    return {
      productIds,
      prices,
      discounts
    }
  }

const handleSuccess = (payload: any) => {
  if (onSuccess) 
    return onSuccess(payload)

  return null
}


  const handleCheckOut = async(amount: number)=>{
    try {
      if(amount === 0) {
        throw new Error("The amount is not valid.!")
      }

      const { data } = await axios.post('/api/razorpay/order', {amount})
      console.log(data);
      const options: ModifiedRazorpayInterface = {
          name: "Ecom Shops",
          description: "Bulk Product",
          amount: data.amount,
          order_id: data.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          currency: 'INR',
          prefill: {
            name: session.data?.user.name as string,
            email: session.data?.user.email as string,
          },
          notes: {
            name: session.data?.user.name as string,
            userId: session.data?.user.id as string,
            orders: JSON.stringify(getOrderPayload())
          },
          handler: handleSuccess
      }
      const rzp = new Razorpay(options)
      rzp.open()

      rzp.on("payment.failed", (payload) => {
        if (onFailed) onFailed(payload)
      })

    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  if (isLoading) return <Skeleton active className="col-span-4" />;

  if (error) {
    return (
      <Result
        status="error"
        title={error.message || "Something went wrong!"}
      />
    );
  }

  if (data.length <= 0) {
    return (
      <Empty description="No product adedd in cart.!">
        <Link href="/"><Button>Add Product Now</Button></Link>
      </Empty>
    );
  }

  return (
    <div>
      <Button
        type="primary"
        size="large"
        className="bg-green-500! hover:bg-green-400! w-full!"
        onClick={()=>handleCheckOut(amount)}
        >
        Checkout
    </Button>
    </div>
  )
}

export default Pay