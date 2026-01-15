'use client'
import 'animate.css';
import ChildrenInterface from '@/interfaces/children.interfsce';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import  { FC } from 'react';
import Logo from './shared/Logo';
import Link from 'next/link';
import { LogoutOutlined, SettingOutlined, ShoppingCartOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { Avatar, Badge, Dropdown, Tooltip } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const menus = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Products',
    href: '/products'
  }
]

const Layout: FC<ChildrenInterface> = ({children}) => {
  const pathname = usePathname()
  const session = useSession()

  const {data} = useSWR('/api/cart?count=true',fetcher)
  
  const blacklists = [
    "/admin",
    "/login",
    "/signup",
    "/user"
  ]

  const userMenu = {
    items: [
      {
        icon: <UserOutlined/>,
        label:<Link href='/user/orders' className='capitalize'>{session && session.data?.user.name}</Link>,
        key: 'fullName'
      },
      {
        icon: <SettingOutlined/>,
        label: <Link href='/user/settings' className='capitalize'>Settings</Link>,
        key: 'setting'
      },
      {
        icon: <LogoutOutlined/>,
        label: <a onClick={()=>signOut()}>Logout</a>,
        key: 'logout'
      },
    ]
  }

  const adminMenu = {
    items: [
      {
        icon: <UserOutlined/>,
        label:<Link href='/admin/orders' className='capitalize'>{session && session.data?.user.name}</Link>,
        key: 'fullName'
      },
      {
        icon: <SettingOutlined/>,
        label: <Link href='/admin/settings' className='capitalize'>Settings</Link>,
        key: 'setting'
      },
      {
        icon: <LogoutOutlined/>,
        label: <a onClick={()=>signOut()}>Logout</a>,
        key: 'logout'
      },
    ]
  }

 const getMenu = (role: string) => {
  if (role === "user") return userMenu
  if (role === "admin") return adminMenu

  signOut()
}


  const isBlacklist = blacklists.some((path)=>pathname.startsWith(path))

  if(isBlacklist)
  return (
    <AntdRegistry>
      <div>{children}</div>
    </AntdRegistry>
  )

  return (
    <div className=''>
        <AntdRegistry>
          <nav className={`bg-white shadow-lg px-12 sticky top-0 left-0 flex ${!session && "gap-120"} ${session && "gap-100"} items-center z-10`} >
            <Logo />
            <div className='flex items-center gap-8'>
                {
                  menus.map((item, index)=>(
                    <Link key={index} href={item.href} className='py-6 px-12 hover:bg-blue-500 hover:text-white'>
                      {item.label}
                    </Link>
                  ))
                }
                {
                  !session.data && 
                  <div className='animate__animated animate__fadeIn flex gap-8'>
                    <Link href="/login" className='py-6 px-12 hover:bg-blue-500 hover:text-white flex'>
                      <UserAddOutlined className='mr-2' />
                      Login
                    </Link>
                    <Link href="/signup" className='py-6 px-12 hover:bg-blue-500 hover:text-white bg-rose-500 text-white font-medium flex'>
                      <UserAddOutlined className='mr-2' />
                      Sign up
                    </Link>
                  </div>
                }
            </div>
            {
              session.data && 
              <div className='flex items-center gap-8 animate__animated animate__fadeIn'>
                {
                  session.data.user.role === "user" &&
                  <Link href='/user/carts'>
                    <Tooltip title="Your Cart's">
                      <Badge count={data && data}>
                        <ShoppingCartOutlined className='text-3xl! text-slate-400!'/>
                      </Badge>
                    </Tooltip>
                  </Link>
                }
                <Dropdown
                    menu={getMenu(session?.data?.user?.role as string)}
                  >
                    <Avatar
                      size="large"
                      src="/images/blank.jpg"
                    />
                </Dropdown>
              </div>
            }
          </nav>
          <div className=' bg-whit w-9/12 mx-auto py-24'> {children} </div>
          <footer className='bg-zinc-900 h-112.5 flex items-center justify-center text-white text-4xl '>
            <h1>My Footer !</h1>
          </footer>
        </AntdRegistry>
    </div>
  );
}

export default Layout;
