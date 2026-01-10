'use client'
import 'animate.css';
import ChildrenInterface from '@/interfaces/children.interfsce';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import  { FC } from 'react';
import Logo from './shared/Logo';
import Link from 'next/link';
import { LogoutOutlined, ProfileOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { Avatar, Dropdown } from 'antd';
import { useSession } from 'next-auth/react';

const menus = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Products',
    href: '/products'
  },
  {
    label: 'Carts',
    href: '/carts'
  },
  {
    label: 'Sign in',
    href: '/login'
  }
]

const Layout: FC<ChildrenInterface> = ({children}) => {
  const pathname = usePathname()
  const session = useSession()
  
  const blacklists = [
    "/admin",
    "/login",
    "/signup",
    "/user"
  ]

    const accountMenu = {
    items: [
      {
        icon: <ProfileOutlined/>,
        label: <a>FullName</a>,
        key: 'fullName'
      },
      {
        icon: <LogoutOutlined/>,
        label: <a>Logout</a>,
        key: 'logout'
      },
      {
        icon: <SettingOutlined/>,
        label: <a>Setting</a>,
        key: 'setting'
      },
    ]
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
          <nav className='bg-white shadow-lg px-12 sticky top-0 left-0 flex justify-between items-center z-10' >
            <Logo />
            <div className='flex items-center'>
                {
                  menus.map((item, index)=>(
                    <Link key={index} href={item.href} className='py-6 px-12 hover:bg-blue-500 hover:text-white'>
                      {item.label}
                    </Link>
                  ))
                }
            </div>
            <Link href="/signup" className='py-6 px-12 hover:bg-blue-500 hover:text-white bg-rose-500 text-white font-medium'>
              <UserAddOutlined className='mr-2' />
              Sign up
            </Link>
            <Dropdown
                menu={accountMenu}
              >
                <Avatar
                  size="large"
                  src="/images/blank.jpg"
                />
            </Dropdown>
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
