'use client'

import useSWR from 'swr'
import Image from 'next/image'
import moment from 'moment'
import fetcher from '@/lib/fetcher'
import { Card, Typography, Skeleton, Result, Empty, Button, Tag, Divider } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import getPrice from '@/lib/priceCalculate'

const { Title, Text } = Typography

export interface UserOrderInterface {
  _id: string
  userOrderId: string
  status: 'processing' | 'dispatched' | 'delivered' | 'returned' | string
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
  userId: string
  __v: number
}

const OrdersPage = () => {
  const { data, isLoading, error } = useSWR<UserOrderInterface[]>('/api/order', fetcher)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    )
  }

  if (error) {
    return <Result status="error" title={error.message || 'Something went wrong!'} />
  }

  if (!data || data.length === 0) {
    return (
      <Empty description="You have not placed any orders yet">
        <Link href="/">
          <Button type="primary">Shop Now</Button>
        </Link>
      </Empty>
    )
  }

  const getStatusConfig = (status: string) => {
  switch (status) {
    case 'processing':
      return {
        label: 'Processing',
        color: 'orange',
      }

    case 'dispatched':
      return {
        label: 'Dispatched',
        color: 'blue',
      }

    case 'delivered':
      return {
        label: 'Delivered',
        color: 'green',
      }

    case 'returned':
      return {
        label: 'Returned',
        color: 'red',
      }

    default:
      return {
        label: 'Unknown',
        color: 'default',
      }
  }


  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <ShoppingOutlined className="text-3xl text-blue-600" />
        <Title level={2} style={{ margin: 0 }}>
          My Orders
        </Title>
      </div>

      {/* Orders */}
      {data.map((order) => {
        let totalMRP = 0
        let totalSaved = 0
        let totalPayable = 0

        order.productIds.forEach((_, index) => {
          const price = order.prices[index]
          const qty = order.quantity[index]
          const discount = order.discounts[index]

          const mrp = price * qty
          const discountAmount = (mrp * discount) / 100
          const finalPrice = mrp - discountAmount

          totalMRP += mrp
          totalSaved += discountAmount
          totalPayable += finalPrice
        })

        const statusConfig = getStatusConfig(order.status)

        return (
          <Card key={order._id} hoverable className="mb-6!">
            {/* Order Info */}
            <div className="flex justify-between items-start mb-4 ">
              <div>
                <Text strong>
                  Order ID: {order.userOrderId.slice(-6).toUpperCase()}
                </Text>
                <br />
                <Text type="secondary" className="text-xs">
                  Placed on {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                </Text>
              </div>
              <Tag color={statusConfig.color}>
                {statusConfig.label}
              </Tag>
            </div>

            <Divider />

            {/* Products */}
            {order.productIds.map((product, index) => {
              const price = order.prices[index]
              const qty = order.quantity[index]
              const discount = order.discounts[index]
              const finalPrice = getPrice(price * qty, discount)

              return (
                <div key={product._id} className="flex gap-4 mb-5">
                  {/* Product Image */}
                  <div className="relative h-20 w-20 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="rounded-lg object-cover border"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Text strong>{product.title}</Text>

                    <div className="mt-1 flex flex-wrap gap-3">
                      <Tag>Qty: {qty}</Tag>
                      <Tag>Price: ₹{price}</Tag>
                      <Tag>Discount: {discount}%</Tag>
                    </div>

                    <Text className="block mt-2 font-semibold text-green-600">
                      Final Price: ₹{finalPrice.toLocaleString()}
                    </Text>
                  </div>
                </div>
              )
            })}
            <Divider />

            <div className="flex flex-col gap-2 text-right">
              <p>
                <span className="text-gray-500">Total MRP:</span>{' '}
                <span className="font-medium">₹{Math.round(totalMRP).toLocaleString()}</span>
              </p>

              <p className="text-green-600">
                You Saved: ₹{Math.round(totalSaved).toLocaleString()}
              </p>

              <p className="text-lg font-semibold">
                Total Payable Amount:{' '}
                <span className="text-blue-600">
                  ₹{Math.round(totalPayable).toLocaleString()}
                </span>
              </p>
            </div>

          </Card>
        )
      })}
    </div>
  )
}

export default OrdersPage
