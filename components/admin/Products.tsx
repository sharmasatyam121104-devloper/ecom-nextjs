'use client'
import {ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, Modal, Skeleton, Tag, Upload } from 'antd'
import Image from 'next/image'
import { useState } from 'react'


const Products = () => {
  const [open, setOpen] = useState(false)

  const onSerach = (value:string)=>{
    console.log(value);
  }

  const handleClose = ()=>{
    setOpen(false)
  }

  const handleCreateProduct = (value:unknown)=>{
    console.log(value);
  }

  return (
    <div className='flex flex-col gap-8'>
      <Skeleton active/>
      <div className='flex justify-between items-center'>
        <Form onFinish={onSerach}>
          <Form.Item name="search" rules={[{required:true}]} className='mb-0! w-87.5'>
            <Input
              placeholder='Search this site' 
              suffix={<Button htmlType='submit' type='text' icon={<SearchOutlined />}/>}
              className=''
            />
          </Form.Item>
        </Form>
        <Button onClick={()=>setOpen(true)} type='primary' size='large' icon={<PlusOutlined />} className='bg-indigo-500!'>Add Product</Button>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {
          Array(20).fill(0).map((item,index)=>(
            <Card
              key={index}
              hoverable
              cover={
                <div className='relative w-full h-45'>
                  <Image src="/images/product.jpg" layout='fill' alt={`product-${index}`} objectFit='cover' className='rounded-t-lg'/>
                </div>
              }
              actions={[
                <EditOutlined  key="edit" className='text-green-400!'/>,
                <DeleteOutlined key="delete" className='text-rose-400!'/>
              ]}
            >
              <Card.Meta 
                title="Mens's Blue Jeans"
                description={
                  <div className='flex gap-2'>
                    <label>₹2000</label>
                    <del>₹2000</del>
                    <label>(50% Off)</label>
                  </div>
                }
              />
              <Tag className="mt-5!" color="cyan">20 PCS</Tag>
              {/* <Tag className="mt-5!" color="red">Out of stock</Tag> */}
            </Card>
          ))
        }
      </div>
      <Modal open={open} width={720} centered footer={null} onCancel={handleClose} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new products</h1>
        <Divider />
        <Form layout='vertical' onFinish={handleCreateProduct}>
          <Form.Item
            label="Product name"
            name="title"
            rules={[{required: true}]}
            >
            <Input size='large' placeholder='Enter product name'/>
          </Form.Item>

          <div className='grid grid-cols-3 gap-6'>  
            <Form.Item
              label="Price"
              name="price"
              rules={[{required: true, type: "number"}]}
              className=''
              >
              <InputNumber size='large' placeholder='00.00' className='w-full!'/>
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[{required: true, type: "number"}]}
              className=''
              >
              <InputNumber size='large' placeholder='20' className='w-full!'/>
            </Form.Item>
            
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{required: true, type: "number"}]}
              className=''
              >
              <InputNumber size='large' placeholder='20' className='w-full!'/>
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{required: true}]}
            className=''
            >
            <Input.TextArea rows={5} placeholder='description' className='w-full!'/>
          </Form.Item>

          <Form.Item name="image" rules={[{required:true}]} >
            <Upload>
              <Button size='large' icon={<UploadOutlined/>}>Upload Product Image</Button>
            </Upload>
          </Form.Item>
            
          <Form.Item>
            <Button  size='large' type='primary' htmlType='submit' icon={<ArrowRightOutlined />} className=''>Add Now</Button>
          </Form.Item>     
        </Form>
      </Modal>
    </div>
  )
}

export default Products