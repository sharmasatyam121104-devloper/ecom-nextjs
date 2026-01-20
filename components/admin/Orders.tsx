'use client'

import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import { Avatar, Image, message, Result, Select, Skeleton, Table, Tag, Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import useSWR, { mutate } from "swr";

// Interface
export interface AdminOrdersInterface {
  _id: string
  userOrderId: string
  status: string
  createdAt: string
  updatedAt: string
  discounts: number[]
  prices: number[]
  quantity: number[]
  productIds: {
    _id: string
    title: string
    image: string
  }[]
  userId: {
    _id: string
    fullname: string
    email: string
    address?: {
      mobile?: string
      street?: string
      area?: string
      city?: string
      state?: string
      pincode?: string
    }
  }
}

const Orders = () => {
  const { data, isLoading, error } = useSWR<AdminOrdersInterface[]>("/api/order", fetcher);

  const handleStatusChange = async (status: string, id: string) => {
    try {
      await axios.put(`/api/order/${id}`, { status });
      mutate("/api/order");
      message.success(`Order status updated to ${status}`);
    } catch (error) {
      return clientCatchError(error);
    }
  }

  const columns = [
    {
      title: "Order ID",
      dataIndex: "userOrderId",
      key: "userOrderId",
      render: (id: string) => <span className="font-mono text-blue-600 font-semibold text-xs">#{id.slice(-6).toUpperCase()}</span>
    },
    {
      title: "Customer",
      key: "customer",
      render: (item: AdminOrdersInterface) => (
        <div className="flex gap-3 items-center">
          <Avatar size="large" className="bg-orange-500 shrink-0">
            {item.userId.fullname.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h1 className="font-medium capitalize truncate text-sm">{item.userId.fullname}</h1>
            <label className="text-gray-500 text-xs truncate">{item.userId.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Items",
      key: "product",
      render: (item: AdminOrdersInterface) => (
        <div className="flex flex-col gap-1">
          {item.productIds.map((prod, idx) => (
            <div key={prod._id} className="text-xs flex items-center gap-2">
              <Image
                src={prod.image}
                alt={prod.title}
                width={24}
                height={24}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                preview={false}
              />
              <span className="truncate w-32">{prod.title}</span>
              <Tag className="m-0 text-[10px]">x{item.quantity[idx]}</Tag>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      key: "price",
      render: (item: AdminOrdersInterface) => {
        const total = item.prices.reduce((acc, curr, idx) => acc + (curr * item.quantity[idx]), 0);
        return <label className="font-bold text-gray-800">₹{total.toLocaleString()}</label>
      },
    },
    {
      title: "Shipping Address",
      key: "address",
      render: (item: AdminOrdersInterface) => {
        const addr = item.userId.address;
        const fullAddress = addr ? `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pincode}` : "Address not provided";
        return (
          <Tooltip title={fullAddress}>
            <p className="text-gray-500 text-xs max-w-50 line-clamp-2">
              {fullAddress}
              <br />
              <span className="text-black font-semibold">{addr?.mobile}</span>
            </p>
          </Tooltip>
        )
      },
    },
    {
      title: "Update Status",
      key: "status",
      render: (item: AdminOrdersInterface) => (
        <Select
          defaultValue={item.status}
          style={{ width: 130 }}
          size="small"
          className="font-medium"
          onChange={(value) => handleStatusChange(value, item._id)}
        >
          <Select.Option value="processing"><Tag color="processing">Processing</Tag></Select.Option>
          <Select.Option value="dispatched"><Tag color="warning">Dispatched</Tag></Select.Option>
          <Select.Option value="delivered"><Tag color="success">Delivered</Tag></Select.Option>
          <Select.Option value="returned"><Tag color="error">Returned</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: "Order Date",
      key: "date",
      render: (item: AdminOrdersInterface) => (
        <div className="text-xs text-gray-500">
          <div>{moment(item.createdAt).format("DD MMM YYYY")}</div>
          <div className="text-[10px] opacity-70">{moment(item.createdAt).format("hh:mm A")}</div>
        </div>
      ),
    },
  ];

  if (isLoading) return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );

  if (error) return <Result status="error" title="Failed to fetch orders" subTitle={error.message} />;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
        <Tag color="blue" className="px-3 py-1 text-sm rounded-full">Total: {data?.length || 0} Orders</Tag>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={{ pageSize: 7, showSizeChanger: false }}
          scroll={{ x: 1000 }}
          className="admin-table"
        />
      </div>
    </div>
  );
};

export default Orders;
