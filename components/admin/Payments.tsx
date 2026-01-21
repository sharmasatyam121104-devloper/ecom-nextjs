'use client'

import fetcher from "@/lib/fetcher";
import { Avatar, Result,  Skeleton, Table, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";

export interface AdminPaymentsInterface {
  _id: string;

  amount: number;
  currency: 'INR';

  fee: number;
  tax: number;

  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  status: 'created' | 'authorized' | 'captured' | 'failed';

  paymentId: string;
  vendor: 'razorpay';

  orderId: {
    userOrderId: string
  }

  userId: {
    _id: string;
    fullname: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;

  __v: number;
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
  console.log(data);

  const columns = [
    {
      title:"Customer",
      key: 'customer',
      width: 250,
      render:(item:AdminPaymentsInterface)=>(
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
      title:"Payment Id",
      key: 'paymentId',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <p className="font-medium">{item.paymentId}</p>
      )
    },
    {
      title:"UserOrder Id",
      key: 'userorderId',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <p className="font-medium">{item.orderId.userOrderId.split('-').pop()}</p>
      )
    },
    {
      title:"Vender",
      key: 'vender',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <label className="capitalize  font-semibold">{item.vendor}</label>
      )
    },
    {
      title:"Amount",
      key: 'amount',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <label className="capitalize  font-semibold">₹{item.amount.toLocaleString()}</label>
      )
    },
    {
      title:"Fee",
      key: 'fee',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <label className="capitalize  font-semibold">₹{(item.fee/100).toLocaleString()}</label>
      )
    },
    {
      title:"Tax",
      key: 'tax',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <label className="capitalize  font-semibold">₹{(item.tax/100).toLocaleString()}</label>
      )
    },
    {
      title:"Method",
      key: 'method',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <label className="capitalize  font-semibold">{item.method}</label>
      )
    },
    {
      title:"Status",
      key: 'status',
      width: 250,
      render: (item:AdminPaymentsInterface)=>(
        <Tag className="capitalize  font-semibold">{item.status}</Tag>
      )
    },
    {
      title:"Date",
      key: 'date',
      width: 250,
      render: (item: AdminPaymentsInterface)=>(
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
        scroll={{x: 1500}}
      />
    </div>
  );
}

export default Payments;
