'use client'

import { PaymentInterface } from "@/interfaces/paymentData.interface";
import fetcher from "@/lib/fetcher";
import { Avatar, Result,  Skeleton, Table } from "antd";
import moment from "moment";
import useSWR from "swr";

export interface OrderInterface {
  orderId: string
  userId: string
  product: Product
  totalAmount: number
  status: "success" | "pending" | "failed"
  createdAt: string
}

export interface Product {
  productId: string
  productName: string
  quantity: number
  price: number
}


// const data = [
//   {
//     "orderId": "ORD1001",
//     "userId": "USR001",
//     "product": {
//       "productId": "P001",
//       "productName": "Wireless Mouse",
//       "quantity": 2,
//       "price": 29.99
//     },
//     "totalAmount": 59.98,
//     "status": "pending",
//     "createdAt": "2025-06-05T10:00:00Z"
//   },
//   {
//     "orderId": "ORD1002",
//     "userId": "USR002",
//     "product": {
//       "productId": "P003",
//       "productName": "Bluetooth Headphones",
//       "quantity": 1,
//       "price": 59.99
//     },
//     "totalAmount": 59.99,
//     "status": "success",
//     "createdAt": "2025-06-04T12:45:00Z"
//   },
//   {
//     "orderId": "ORD1003",
//     "userId": "USR003",
//     "product": {
//       "productId": "P002",
//       "productName": "USB-C Charger",
//       "quantity": 3,
//       "price": 29.99
//     },
//     "totalAmount": 89.97,
//     "status": "error",
//     "createdAt": "2025-06-03T14:30:00Z"
//   },
//   {
//     "orderId": "ORD1004",
//     "userId": "USR004",
//     "product": {
//       "productId": "P004",
//       "productName": "Laptop Stand",
//       "quantity": 1,
//       "price": 49.99
//     },
//     "totalAmount": 49.99,
//     "status": "warning",
//     "createdAt": "2025-06-02T16:00:00Z"
//   }
// ]

const Payments = () => {
  const {data, isLoading, error} = useSWR("/api/payment",fetcher)

  const columns = [
    {
      title:"Payment Id",
      key: 'paymentId',
      render: (item:PaymentInterface)=>(
        // <label className="text-gray-500">Flat 12B, Shanti Apartments, MG Road, Andheri East, Mumbai 400069</label>
        <p className="font-medium">{item.paymentId}</p>
      )
    },
    {
      title:"Customer",
      key: 'customer',
      render:(item:PaymentInterface)=>(
        <div className="flex gap-3">
          <Avatar size="large" className="bg-orange-500!">M</Avatar>
          <div className="flex flex-col">
            <h1 className="font-medium">{item.userId.fullname}</h1>
            <label className="text-gray-500">{item.userId.email}</label>
          </div>
        </div>
      ),
    },
    {
      title:"Product",
      key: 'product',
      render: (item:PaymentInterface)=>(
        <label>{item.orderId.productId.title}</label>
      )
    },
    {
      title:"Amount",
      key: 'amount',
      render: (item:PaymentInterface)=>(
        <label>₹{item.orderId.productId.price}</label>
      )
    },
    {
      title:"Vender",
      key: 'vender',
      render: (item:PaymentInterface)=>(
        <label className="capitalize  font-semibold">{item.vendor}</label>
      )
    },
    {
      title:"Date",
      key: 'date',
      render: (item: PaymentInterface)=>(
        <label>{moment(item.createdAt).format('MMM DD, YYYY hh:mm A')}</label>
      )
    },
  ]

  if (isLoading) return <Skeleton active className="col-span-4" />;

  if (error) {
    return (
      <Result
        status="error"
        title={error.message || "Something went wrong!"}
      />
    );
  }

  return (
    <div className="space-y-8">
      <Table 
        columns={columns}
        dataSource={data}
        rowKey="_id"
      />
    </div>
  );
}

export default Payments;
