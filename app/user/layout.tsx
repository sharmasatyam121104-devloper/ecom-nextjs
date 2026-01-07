import UserLayout from "@/components/user/UserLayout"
import ChildrenInterface from "@/interfaces/children.interfsce"
import { FC } from "react"

const UserLayoutRouter: FC<ChildrenInterface> = ({children}) => {
  return (
  <UserLayout>
    {children}
  </UserLayout>
  )
}

export default UserLayoutRouter