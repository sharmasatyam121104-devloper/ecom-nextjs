'use client'

import { Result, Button } from "antd"
import { useRouter } from "next/navigation"
import { LoginOutlined } from "@ant-design/icons"

const AuthFailed = () => {
  const router = useRouter()

  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <Result
        status="403"
        title="Authentication Failed"
        subTitle="Your session has expired or you are not authorized to access this page."
        extra={
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        }
      />
    </div>
  )
}

export default AuthFailed
