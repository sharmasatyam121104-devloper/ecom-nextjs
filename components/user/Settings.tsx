'use client'

import clientCatchError from "@/lib/client-catch-error"
import {
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  PhoneOutlined,
  PushpinOutlined,
  SaveOutlined
} from "@ant-design/icons"
import { Button, Card, Form, Input, message, Space, Typography } from "antd"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export interface HandleAddressInterface {
  mobile: string
  street: string
  area: string
  city: string
  state: string
  pincode: string
}

const Settings = () => {
  const { Title, Text } = Typography
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [address, setAddress] = useState<HandleAddressInterface | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  // Fetch address from API
  const fetchAddress = async () => {
    try {
      const { data } = await axios.get('/api/user/profile')
      setAddress(data.address)
      if (!justSaved) {
        form.setFieldsValue(data.address)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]) 

  // Save address
  const handleSaveAddress = async (value: HandleAddressInterface) => {
    try {
      setLoading(true)
      const { data } = await axios.put('/api/user/profile', value)

      setAddress(data.address)
      form.resetFields()
      setJustSaved(true)

      message.success("Address saved successfully")
    } catch (error) {
      clientCatchError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-xl rounded-xl">

        <Title level={3}>Save Delivery Address</Title>
        <Text type="secondary">
          Please add your address. You won’t be able to place an order without it.
        </Text>

        <Form
          form={form}
          layout="vertical"
          className="mt-6"
          onFinish={handleSaveAddress}
        >
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { required: true, message: 'Mobile number is required' },
              { pattern: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="street"
            label="Street / House No."
            rules={[{ required: true, message: 'Street address is required' }]}
          >
            <Input prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item
            name="area"
            label="Area"
            rules={[{ required: true, message: 'Area is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'City is required' }]}
          >
            <Input prefix={<EnvironmentOutlined />} />
          </Form.Item>

          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'State is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[
              { required: true, message: 'Pincode is required' },
              { pattern: /^[0-9]{6}$/, message: 'Enter a valid 6-digit pincode' }
            ]}
          >
            <Input />
          </Form.Item>

          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            block
            icon={<SaveOutlined />}
          >
            Save Address
          </Button>
        </Form>

        {address?.pincode && (
          <Card className="mt-6 border rounded-xl">
            <Typography.Title level={4} className="mb-4">
              Saved Address
            </Typography.Title>

            <Space orientation="vertical" size="middle" className="w-full">

              <Space>
                <PhoneOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>Mobile:</strong> {address.mobile}
                </Typography.Text>
              </Space>

              <Space>
                <HomeOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>Street:</strong> {address.street}
                </Typography.Text>
              </Space>

              <Space>
                <EnvironmentOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>Area:</strong> {address.area}
                </Typography.Text>
              </Space>

              <Space>
                <GlobalOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>City:</strong> {address.city}
                </Typography.Text>
              </Space>

              <Space>
                <PushpinOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>State:</strong> {address.state}
                </Typography.Text>
              </Space>

              <Space>
                <PushpinOutlined className="text-gray-500" />
                <Typography.Text>
                  <strong>Pincode:</strong> {address.pincode}
                </Typography.Text>
              </Space>

            </Space>
          </Card>
        )}

      </Card>
    </div>
  )
}

export default Settings
