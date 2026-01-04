import { message } from "antd"
import axios from "axios"

const clientCatchError = (error: unknown) => {

  //Axios error
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message ||  error.response?.statusText || "Server error"

    return message.error(serverMessage)
  }

  if (error instanceof Error) {
    return message.error(error.message)
  }
  
  return message.error("Internal server error")
}

export default clientCatchError
