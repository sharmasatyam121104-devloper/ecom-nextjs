'use client'
import 'animate.css';
import ChildrenInterface from '@/interfaces/children.interfsce';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { FC } from 'react';

const Layout: FC<ChildrenInterface> = ({children}) => {
  return (
    <div>
        <AntdRegistry>
            <div> {children} </div>
        </AntdRegistry>
    </div>
  );
}

export default Layout;
