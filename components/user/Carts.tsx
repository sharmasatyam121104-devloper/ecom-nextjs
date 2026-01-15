'use client'
import { CartInterface } from "@/interfaces/cartData.interface";
import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, message, Result, Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr"

const Carts = () => {
  const {data, error, isLoading} = useSWR('/api/cart', fetcher)
  const [loading, setLoading] = useState({state: false, index:0, ButtonIndex:0})

  const handleUpadteProductQuantity = async(productId: string, quantity: number, index: number ,ButtonIndex: number)=>{
      try {
        setLoading({state: true, index, ButtonIndex})
        await axios.put(`/api/cart/${productId}`, {quantity})
        mutate('/api/cart')
      } 
      catch (error) {
        clientCatchError(error)  
      }
      finally {
        setLoading({state: false, index:0, ButtonIndex:0})
      }
  }

  const handleDeleteCartProduct = async(productId: string,index: number ,ButtonIndex: number)=>{
    try {
      setLoading({state: true, index, ButtonIndex})
      await axios.delete(`/api/cart/${productId}`)
      message.success("Product remove from cart successfully.!")
      mutate('/api/cart')
    }
    catch (error) {
      clientCatchError(error)  
    }
    finally {
      setLoading({state: false, index:0, ButtonIndex:0})
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
  <div className="space-y-6">
  {data.map((item: CartInterface, index: number) => {
    const product = item.productId
    const discountedPrice =
      product.price - (product.price * (product.discount || 0)) / 100

    return (
      <Card key={index} hoverable className=" mb-2! ">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Product Image */}
          <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
            <Image 
              src={product.image} 
              width={10}
              height={0}
              alt={product.title}  
               className="w-full h-full object-cover"
              loading="eager" 
              sizes="(max-width: 768px) 100vw, 
                      (max-width: 1200px) 50vw, 
                      33vw"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold capitalize">
              {product.title}
            </h2>

            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-green-600">
                ₹{discountedPrice}
              </span>
              <del className="text-gray-400">
                ₹{(product.price).toFixed(2)}
              </del>
              <span className="text-sm text-green-500">
                ({product.discount}% OFF)
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <Button 
              loading={loading.state && loading.index === index && loading.ButtonIndex === 0 }
              onClick={()=>handleUpadteProductQuantity(product._id,  -1,index, 0)}>
              <MinusOutlined />
            </Button>
            <span className="px-4 py-1 border rounded-md font-medium">
              {item.qauantity}
            </span>
            <Button
              loading={loading.state && loading.index === index && loading.ButtonIndex === 1 }
              onClick={()=>handleUpadteProductQuantity(product._id, +1,index, 1)}
              >
              <PlusOutlined />
            </Button>
          </div>

          {/* Item Total */}
          <div className="min-w-30 text-right">
            <p className="text-sm text-gray-500">Item Total</p>
            <p className="text-lg font-semibold">
              ₹{(discountedPrice * item.qauantity).toFixed(2)}
            </p>
          </div>

          {/* Remove */}
          <div>
            <Button 
              danger
              type="text" 
              loading={loading.state && loading.index === index && loading.ButtonIndex === 1 }
              onClick={()=>handleDeleteCartProduct(product._id,index, 1)}>
              Remove
            </Button>
          </div>

        </div>
      </Card>
    )
  })}

  {/* Cart Summary */}
  <Card className="shadow-lg!">
    {(() => {
      // Total original price (without discount)
      const totalOriginal = data.reduce((sum: number, item: CartInterface) => {
        return sum + item.productId.price * item.qauantity
      }, 0)

      // Total discounted price
      const totalDiscounted = data.reduce((sum: number, item: CartInterface) => {
        const discountedPrice =
          item.productId.price -
          (item.productId.price * (item.productId.discount || 0)) / 100

        return sum + discountedPrice * item.qauantity
      }, 0)

      // Total savings
      const totalSaved = totalOriginal - totalDiscounted

      return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left */}
          <div>
            <h2 className="text-xl font-semibold">Cart Summary</h2>
            <p className="text-gray-500 text-sm">
              Review your cart items before checkout
            </p>

            {totalSaved > 0 && (
              <p className="mt-2 text-green-600 font-medium">
                🎉 Aapne ₹{totalSaved.toFixed(0)} save kiye hain!
              </p>
            )}
          </div>

          {/* Right */}
          <div className="text-right space-y-2 min-w-50">
            <div className="flex justify-between gap-6 text-gray-600">
              <span>Total Price</span>
              <span>₹{totalOriginal.toFixed(0)}</span>
            </div>

            <div className="flex justify-between gap-6 text-green-600">
              <span>Discount</span>
              <span>- ₹{totalSaved.toFixed(0)}</span>
            </div>

            <hr />

            <div className="flex justify-between gap-6 font-bold text-lg">
              <span>Grand Total</span>
              <span className="text-green-700">
                ₹{totalDiscounted.toFixed(0)}
              </span>
            </div>

            <Button
              type="primary"
              size="large"
              className="bg-green-500! hover:bg-green-400! w-full!"
            >
              Checkout
            </Button>
          </div>

        </div>
      )
    })()}
  </Card>

</div>


  )
}

export default Carts