'use client'
import React, { FC } from 'react';
import {
  CreditCardOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShopOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import ChildrenInterface from '@/interfaces/children.interfsce';
import Logo from '../shared/Logo';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

  export const getBreadCrambs = (pathName:string)=>{
    const arr = pathName.split("/")
    const bread = arr.map((item)=>({
      title: item
    }))
    return bread
  }

const AdminLayout: FC<ChildrenInterface> = ({children}) => {
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathName = usePathname()

  const handleLogout = async()=>{
    await signOut()
  }

  const menu = [
    {
      icon: <ShopOutlined/>,
      label: <Link href="/admin/products">Products</Link>,
      key: "/admin/products",
    },
    {
      icon: <ReconciliationOutlined/>,
      label: <Link href="/admin/orders">Orders</Link>,
      key: "/admin/orders",
    },
    {
      icon: <CreditCardOutlined/>,
      label: <Link href="/admin/payments">Payments</Link>,
      key: "/admin/payments",
    },
    {
      icon: <UserSwitchOutlined/>,
      label: <Link href="/admin/users">Users</Link>,
      key: "/admin/users",
    },
  ]

  const accountMenu = {
    items: [
      {
        icon: <ProfileOutlined/>,
        label: <a>FullName</a>,
        key: 'fullName'
      },
      {
        icon: <LogoutOutlined onClick={handleLogout}/>,
        label: <a onClick={handleLogout}>Logout</a>,
        key: 'logout'
      },
      {
        icon: <SettingOutlined/>,
        label: <a>Setting</a>,
        key: 'setting'
      },
    ]
  }




  return (
    <Layout hasSider>
      <Sider style={siderStyle} width={280}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" items={menu} selectedKeys={[pathName]}/>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center' >
          <div className='px-8 flex justify-between items-center w-full'>
            <Logo/>
            <div>
              <Dropdown
                menu={accountMenu}
              >
                <Avatar 
                  size="large"
                  src="/images/blank.jpg"
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} className='px-8  flex flex-col gap-8'>
          <Breadcrumb
            items={getBreadCrambs(pathName)}
          />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;