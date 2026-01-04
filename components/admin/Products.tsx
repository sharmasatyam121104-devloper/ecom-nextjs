'use client'
import clientCatchError from '@/lib/client-catch-error'
import {ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, message, Modal, Pagination, Popconfirm, Result, Skeleton, Tag, Upload } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import type { UploadFile } from "antd/es/upload/interface"
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import fetcher from '@/lib/fetcher'

interface UploadValue {
  file: UploadFile
}

interface ProductFormValues {
  title: string
  description: string
  price: number
  discount: number
  image: UploadValue
}

interface ProductInterface {
  _id:string
  title: string;
  description: string;
  price: number;
  discount?: number;
  slug?:string
  image:string
  quantity:number
}


const Products = () => {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3)
  const [editId, setEditId] = useState<string | null>(null)
  const [productForm] = Form.useForm()
  const {data, error, isLoading} = useSWR(`/api/product?page=${page}&limit=${limit}`,fetcher)


  const onSerach = (value:string)=>{
    console.log(value);
  }

  const handleClose = ()=>{
    setOpen(false)
    setEditId(null)
    productForm.resetFields()
  }

  const handleCreateProduct = async(values: ProductFormValues)=>{
    try {
      const imageFile: File | undefined = values.image?.file?.originFileObj

      if (!imageFile) {
        message.error("Image is required")
        return
      }

      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("price", String(values.price))
      formData.append("discount", String(values.discount))
      formData.append("image", imageFile)
        
      await axios.post('/api/product', formData)
      message.success("Product added successfully !")
      handleClose()

    } 
    catch (error) {
      clientCatchError(error)
    }
  }

  const handlePaginate = (page: number)=>{
    setPage(page)
    setLimit(limit)
  }

  const handleDeleteProduct = async(id:string)=>{
    try {
      await axios.delete(`/api/product/${id}`)
      mutate(`/api/product?page=${page}&limit=${limit}`)
      message.success("Product delted successfully.!")
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const handleEditProduct = async(product:ProductInterface)=>{
    try {
      setEditId(product._id)
      setOpen(true)
      productForm.setFieldsValue(product)
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const handleSaveProduct = async(value: ProductFormValues)=>{
    try {
      await axios.put(`/api/product/${editId}`, value)
      handleClose()
      mutate(`/api/product?page=${page}&limit=${limit}`)
      message.success("Product edited successfully.!")
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const handleChangeImage = async(id:string)=>{
    try {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.click()

      input.onchange = async ()=>{
        if(!input.files)
          return message.error("File not selected")

        const file = input.files[0]
        input.remove()
        const formData = new FormData()
        formData.append("id", id)
        formData.append("image", file)
        await axios.put("/api/product/change-image", formData)
        mutate(`/api/product?page=${page}&limit=${limit}`)
        message.success("Image changed successfully")
      }
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  if(error){
    console.log(error)
    return(
        <Result
          status="error"
          title={error.message || "Something went wrong.!"}
        />
    )
  }

  if (isLoading) {
    return <Skeleton active/>
  }

  return (
    <div className='flex flex-col gap-8'>
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
          data.products.map((item:ProductInterface,index:number)=>(
            <Card
              key={index}
              hoverable
              cover={
                <div className='relative w-full h-45'>
                  <Popconfirm title="Do You Want to Change Image?" onConfirm={()=>handleChangeImage(item._id)}>
                   <Image src={item.image} layout='fill' alt={`product-${index}`} objectFit='cover' className='rounded-t-lg'/>
                  </Popconfirm>
                </div>
              }
              actions={[
                <EditOutlined  key="edit" className='text-green-400!' onClick={()=>handleEditProduct(item)}/>,
                <Popconfirm key="delete"  title="Do You Want to delete this product?" onConfirm={()=>handleDeleteProduct(item._id)}>
                  <DeleteOutlined className='text-rose-400!' />
                </Popconfirm>
              ]}
            >
              <Card.Meta 
                title={item.title}
                description={
                  <div className='flex gap-2'>
                    <label>₹{item.price}</label>
                    <del>₹{item.price}</del>
                    <label>({item.discount}% Off)</label>
                  </div>
                }
              />
              <Tag className="mt-5!" color="cyan">${item.quantity} PCS</Tag>
              {/* <Tag className="mt-5!" color="red">Out of stock</Tag> */}
            </Card>
          ))
        }
      </div>

      <div className='flex justify-end w-full'>
        <Pagination
          total={data.totalNoProduct}
          onChange={handlePaginate}
          current={page}
          pageSizeOptions={[16,32,64,100]}
          defaultPageSize={limit}
        />
      </div>

      <Modal open={open} width={720} centered footer={null} onCancel={handleClose} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new products</h1>
        <Divider />
        <Form layout='vertical' onFinish={editId ? handleSaveProduct : handleCreateProduct} form={productForm}>
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

          {
            !editId &&
            <Form.Item name="image" rules={[{required:true}]} >
              <Upload  fileList={[]}>
                <Button size='large' icon={<UploadOutlined/>}>Upload Product Image</Button>
              </Upload>
            </Form.Item>
          }
            
          <Form.Item>
            {
              editId ?
              <Button  size='large' type="primary" danger htmlType='submit' icon={<SaveOutlined />} className=''>Save Changes</Button>
              :
              <Button  size='large' type='primary' htmlType='submit' icon={<ArrowRightOutlined />} className=''>Add Now</Button>
            }
          </Form.Item>     
        </Form>
      </Modal>
    </div>
  )
}

export default Products