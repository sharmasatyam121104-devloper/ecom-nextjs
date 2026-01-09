'use client'
import ChildrenInterface from '@/interfaces/children.interfsce'
import { LogoutOutlined, ReconciliationOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import Link from 'next/link'
import  { FC } from 'react'
import { getBreadCrambs } from '../admin/AdminLayout'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const UserLayout:FC<ChildrenInterface> = ({children}) => {
    const pathname = usePathname()

    const handleLogout = async()=>{
      await signOut()
    }
  
  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/user/carts">Carts</Link>,
      key: 'cart'
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/user/orders">Orders</Link>,
      key: 'orders'
    },
    {
      icon: <SettingOutlined />,
      label: <Link href="/user/settings">Settings</Link>,
      key: 'settings'
    }
  ]

    return (
    <Layout className='min-h-screen bg-white'>
        <Sider width={300} className="border-r! border-gray-100! bg-white relative! ">
          {/* Menu */}
          <Menu
            theme="light"
            mode="inline"
            items={menus}
            className="h-full! pb-44! py-4! "
          />

          {/* User Section */}
          <div className="absolute bottom-0 left-0 w-full bg-indigo-600 p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                size={56}
                className="bg-orange-500! text-xl! font-semibold!"
              >
                S
              </Avatar>

              <div className="leading-tight">
                <h1 className="text-white font-medium text-base">
                  Er Saurav
                </h1>
                <p className="text-indigo-200 text-sm">
                  example@mail.com
                </p>
              </div>
            </div>
            

            <Button
              block
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="bg-white text-indigo-600 font-medium hover:bg-indigo-50!"
            >
              Logout
            </Button>
          </div>
        </Sider>

        <Layout>
          <Layout.Content>
            <div className='w-11/12 mx-auto py-8 min-h-screen'>
              <Breadcrumb
                items={getBreadCrambs(pathname)}
              />

              <Card className='mt-6!'>
                {children}
              </Card>
            </div>
          </Layout.Content>
        </Layout>
    </Layout>
  )
}

export default UserLayout