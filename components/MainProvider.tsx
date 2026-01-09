'use client'
import ChildrenInterface from '@/interfaces/children.interfsce'
import { SessionProvider } from 'next-auth/react'
import  { FC } from 'react'
import Layout from './Layout'

const MainProvider: FC<ChildrenInterface> = ({children}) => {
  return (
    <SessionProvider>
        <Layout>
            {children}
        </Layout>
    </SessionProvider>
  )
}

export default MainProvider