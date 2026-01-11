'use client'
import {
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider, Form, Input } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import Logo from './shared/Logo'
import { getSession, signIn } from 'next-auth/react'
import clientCatchError from '@/lib/client-catch-error'
import { useRouter } from 'next/navigation'



interface LoginValueInterfce {
    email:string
    password: string
}

const Login = () => {
  const router = useRouter()

  //handle login function
  const login = async(values: LoginValueInterfce) => {
    try {
          const payLoad = {
            ...values,
            redirect: false,
          }
          await signIn("credentials", payLoad)
          const session = await getSession()

          if(!session) {
            throw new Error("Failed to login user")
          }

          if(session.user.role === "user") {
            return router.replace("/user/orders")
          }

          if(session.user.role === "admin") {
            return router.replace("/admin/orders")
          }
    } 
    catch (error) {
      clientCatchError(error)
    }
  }

  //handle login with google
  const loginWithGoogle = async() => {
    try {
      const payLoad = {
        redirect: true,
        callbackUrl: "/user/orders",
      }
      const res = await signIn('google', payLoad)
      console.log(res);
    } 
    catch (error) {
      clientCatchError(error)
    }
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
              Login Now
            </h2>
            </div>

            <Form layout="vertical" onFinish={login}>

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
                rules={[{ required: true, message: 'Please enter password' },{ min: 8, message: 'Password must be at least 8 characters' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              {/* Submit */}
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              <Divider>OR</Divider>

              {/* Google */}
              <Button onClick={loginWithGoogle} icon={<GoogleOutlined  />} block className='hover:text-red-500!'>
                Continue with Google
              </Button>

              {/* Redirect */}
              <p className="text-center mt-4">
                Don&#39;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline!" as="signup">
                  Sign Up
                </Link>
              </p>
            </Form>
          </div>

        </div>
      </Card>
    </div>
  )
}

export default Login
