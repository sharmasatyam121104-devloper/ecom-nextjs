import AdminLayout from '@/components/admin/AdminLayout';
import ChildrenInterface from '@/interfaces/children.interfsce';
import { FC } from 'react';

const AdminlayoutRouter: FC<ChildrenInterface> = ({children}) => {
  return (
    <AdminLayout>
        {children}
    </AdminLayout>
  );
}

export default AdminlayoutRouter;
