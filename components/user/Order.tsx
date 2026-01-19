'use client'

import useSWR from 'swr'
import Image from 'next/image'
import moment from 'moment'
import fetcher from '@/lib/fetcher'
// List ko hata kar Flex add kiya gaya hai
import { Card, Tag, Typography, Divider, Skeleton, Space, Badge, Flex, Result, Empty, Button } from 'antd'
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

interface Product {
  _id: string
  title: string
  image: string
}

interface Order {
  _id: string
  userOrderId: string
  createdAt: string
  status: 'processing' | 'delivered' | 'cancelled'
  prices: number[]
  discounts: number[]
  quantity: number[]
  productIds: Product[]
}

const OrdersPage = () => {
  const { data, isLoading, error } = useSWR<Order[]>('/api/order', fetcher)

  const getStatusTag = (status: string) => {
    const statusConfig = {
      processing: { color: 'gold', icon: <ClockCircleOutlined />, label: 'Processing' },
      delivered: { color: 'green', icon: <CheckCircleOutlined />, label: 'Delivered' },
      cancelled: { color: 'error', icon: <CloseCircleOutlined />, label: 'Cancelled' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing
    return (
      <Tag icon={config.icon} color={config.color} className="px-3 py-0.5 rounded-full font-medium capitalize">
        {config.label}
      </Tag>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    )
  }

    if (error) {
      return (
        <Result
          status="error"
          title={error.message || "Something went wrong!"}
        />
      );
    }
  
    if (data) {
      if (data.length <= 0 ) {
        return (
          <Empty description="No orders found!">
            <Link href="/"><Button>Add Product Now</Button></Link>
          </Empty>
        );
      }
    }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <ShoppingOutlined className="text-3xl text-blue-600" />
        <Title level={2} style={{ margin: 0 }}>My Orders</Title>
      </div>

      <Flex vertical gap="large">
        {data?.map((order) => {
          let totalPaid = 0
          let totalSaved = 0

          order.prices.forEach((price, i) => {
            const qty = order.quantity[i]
            const discount = order.discounts[i] || 0
            const discountAmount = (price * qty * discount) / 100
            totalPaid += (price * qty) - discountAmount
            totalSaved += discountAmount
          })

          return (
            <Card
              key={order._id}
              hoverable
              className="shadow-sm border-gray-100 overflow-hidden"
              title={
                <div className="flex flex-wrap justify-between items-center py-2 gap-2">
                  <Space size={4}>
                    <Text type="secondary" className="text-xs uppercase tracking-wider">Order ID:-</Text>
                    <Text strong className="font-mono">{order.userOrderId}</Text>
                  </Space>
                  <div className="text-right">
                    {getStatusTag(order.status)}
                  </div>
                </div>
              }
            >
              {/* Products Section */}
              <div className="space-y-4">
                {order.productIds.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-4 group">
                    <div className="relative h-20 w-20 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="rounded-lg object-cover border border-gray-50"
                      />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <Text strong className="block text-base leading-tight group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </Text>
                        <Text type="secondary">Qty: {order.quantity[index]}</Text>
                      </div>

                      <div className="md:text-right">
                        <Text strong className="block text-lg">₹{order.prices[index]}</Text>
                        {order.discounts[index] > 0 && (
                          <Badge count={`${order.discounts[index]}% OFF`} style={{ backgroundColor: '#52c41a' }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider className="my-4" />

              {/* Summary Section */}
              <Flex 
                justify="space-between" 
                align="center" 
                className="bg-gray-50 p-4 rounded-xl flex-wrap gap-4"
              >
                <div className="flex flex-col">
                  <Text type="secondary">
                    Order Date: {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </Text>
                  {totalSaved > 0 && (
                    <Text type="success" className="font-medium mt-1">
                      🎉 Total Savings: ₹{totalSaved.toFixed(0)}
                    </Text>
                  )}
                </div>

                <div className="text-right">
                  <Text type="secondary" className="block text-xs uppercase">Total Paid</Text>
                  <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
                    ₹{totalPaid.toLocaleString('en-IN')}
                  </Title>
                </div>
              </Flex>
            </Card>
          )
        })}
      </Flex>
    </div>
  )
}

export default OrdersPage