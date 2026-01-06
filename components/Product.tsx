'use client'
import ProductsResponseInterface from "@/interfaces/productDataRes.interface"
import getPrice from "@/lib/priceCalculate";
import { ArrowRightOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card } from "antd"
import Image from "next/image"
import Link from "next/link";

interface ProductProps {
  data: ProductsResponseInterface;
}


const Product = ({ data }: ProductProps) => {
  return (
    <div>
      <div className='grid grid-cols-4 gap-8'>
        {
          data.products.map((item,index)=>(
            <Card
              key={index}
              className="shadow-xl!"
              hoverable
              cover={
                <div className='relative w-full h-60 '>
                  <Image 
                    src={item.image} 
                    fill alt={`product-${item.title}`}  
                    className='rounded-t-lg object-cover' 
                    loading="eager" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              }
              actions={[
                <Button key='add-cart' icon={<ShoppingCartOutlined />} type="primary" className="">Add Cart</Button>,
                <Link href={`/product/${item.slug}`} key='add-cart'>
                  <Button  icon={<ArrowRightOutlined />} type="primary" className="bg-green-500! hover:bg-green-400!">Buy Now</Button>
                </Link>
              ]}
            >
              <Card.Meta 
                title={<Link href={`/product/${item.slug}`} className="hover:underline! capitalize! text-inherit!">{item.title}</Link>}
                description={
                  <div className='flex gap-2'>
                    <label>₹{getPrice(item.price , item.discount || 0)}</label>
                    <del>₹{item.price}</del>
                    <label>({item.discount}% Off)</label>
                  </div>
                }
              />
              {/* <Tag className="mt-5!" color="red">Out of stock</Tag> */}
            </Card>
          ))
        }
      </div>

    </div>
  )
}

export default Product