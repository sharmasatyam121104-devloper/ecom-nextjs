'use client'

import { OrderInterface } from "@/interfaces/orderData.interface";
import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import { Avatar, message, Result, Select, Skeleton, Table, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import useSWR, { mutate } from "swr";

const Orders = () => {
  const { data, isLoading, error } = useSWR("/api/order", fetcher);

  const handleStatusChange = async(status: string, id: string)=>{
    try {
      await axios.put(`/api/order/${id}`,{status})
      mutate("/api/orde")
      message.success(`Order status updated successfully to ${status}`)
    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (item: OrderInterface) => (
        <div className="flex gap-3 items-center">
          <Avatar size="large" className="bg-orange-500">
            {item.userId.fullname.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-medium capitalize">{item.userId.fullname}</h1>
            <label className="text-gray-500">{item.userId.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Product",
      key: "product",
      render: (item: OrderInterface) => (
        <div>
          <label className="font-medium">{item.productId.title}</label>
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (item: OrderInterface) => (
        <label>₹{item.productId.price}</label>
      ),
    },
    {
      title: "Address",
      key: "address",
      render: (item: OrderInterface) => (
        <label className="text-gray-500 text-sm">
          {item.address || "Flat 12B, Shanti Apartments, MG Road, Andheri East, Mumbai 400069"}
        </label>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item: OrderInterface) => (
        <Select
          defaultValue={item.status}
          style={{ width: 140 }}
          className="font-medium"
          onChange={(value)=>handleStatusChange(value,item._id)}
        >
          <Select.Option value="processing">
            <Tag color="orange">Processing</Tag>
          </Select.Option>
          <Select.Option value="dispatched">
            <Tag color="blue">Dispatched</Tag>
          </Select.Option>
          <Select.Option value="returned">
            <Tag color="red">Returned</Tag>
          </Select.Option>
          <Select.Option value="delivered">
            <Tag color="green">Delivered</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: "Date",
      key: "date",
      render: (item: OrderInterface) => (
        <label>{moment(item.createdAt).format("MMM DD, YYYY hh:mm:ss A")}</label>
      ),
    },
  ];

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
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Orders;
