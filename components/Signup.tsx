'use client'
import {
  LockOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Card, Form, Input } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import Logo from './shared/Logo'

interface SignupValueInterfce {
    fullname: string
    email:string
    password: string
}

const Signup = () => {
  const onFinish = (values: SignupValueInterfce) => {
    console.log(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT IMAGE */}
          <div className="hidden md:flex items-center justify-center ">
            <Image
              src="/images/signup.png"
              alt="signup"
              width={500}
              height={500}
              className="object-contain rounded-l-2xl "
              priority
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-8">
            <div className='flex items-center justify-center flex-col gap-4'>
                <Logo/>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Create Account
            </h2>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              {/* Full Name */}
              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your full name"
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Invalid email' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter password' }, { min: 8, message: 'Password must be at least 8 characters' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              {/* Submit */}
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>


              {/* Redirect */}
              <p className="text-center mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600">
                  Login
                </Link>
              </p>
            </Form>
          </div>

        </div>
      </Card>
    </div>
  )
}

export default Signup
