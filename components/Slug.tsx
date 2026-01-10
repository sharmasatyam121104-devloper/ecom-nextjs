'use client'
import getPrice from '@/lib/priceCalculate';
import {ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Empty, Tag } from 'antd';
import Image from 'next/image';


interface ProductInterface {
  _id:string
  title: string
  description: string
  price: number
  discount: number
  slug?:string
  image:string
  quantity:number
}

interface SlugProps {
  data: ProductInterface;
}

const Slug = ({data}:SlugProps) => {

  if (!data) {
    return(
      <div className="max-w-6xl mx-auto p-6 shadow-2xl">
        <Empty description="Information not yet fetched.!"/>
      </div>
    )
  }

  return (
  
      <div className="max-w-6xl mx-auto p-6 shadow-2xl">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className='relative w-96 h-96'>
              <Image 
                src={data.image}
                alt={data.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
              />
            </div>
            <div>
              <h1 className='text-2xl font-bold capitalize'>{data.title}</h1>
              <Divider />
              <div className="flex items-center gap-3 text-xl">
                <span className="font-bold text-green-600">₹{getPrice(data.price,data.discount)}</span>
                {data && (
                  <>
                    <del className="text-gray-400">₹{data.price}</del>
                    <Tag color="green">{data.discount}% OFF</Tag>
                  </>
                )}
              </div>
              <p className="mt-4 text-gray-600">{data.description}</p>
              <Divider />
              <p>
                Stock:
                {data.quantity > 0 ? (
                  <Tag color="blue" className="ml-2">
                    In Stock ({data.quantity})
                  </Tag>
                ) : (
                  <Tag color="red" className="ml-2">
                    Out of Stock
                  </Tag>
                )}
              </p>
              <div className="mt-6 flex gap-4">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                >
                  Add to Cart
                </Button>

                <Button
                  danger
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  size="large"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

  )
}

export default Slug