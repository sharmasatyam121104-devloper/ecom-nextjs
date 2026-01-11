'use client'
import { UserInterface } from '@/interfaces/user.interface'
import fetcher from '@/lib/fetcher'
import { Card, Result, Skeleton } from 'antd'
import moment from 'moment'
import Image from 'next/image'
import useSWR from 'swr'


const Users = () => {
  const {data, isLoading, error} = useSWR('/api/user',fetcher)

  if(isLoading) {
    return <Skeleton active className='col-span-4'/>
  }

  if(error) {
    return(
      <Result
          status="error"
          title={error.message || "Something went wrong.!"}
        />
    )
  }

  return (
    <div className='grid grid-cols-4 gap-8'>
      {
        data.map((item: UserInterface, index:number) => (
          <Card
            key={index}
            hoverable
            className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              
              {/* Avatar */}
              <div className="relative">
                <Image
                  src={item.image || "/images/blank.jpg"}
                  width={96}
                  height={96}
                  alt={`avatar-${item.fullname}`}
                  className="rounded-full object-cover border-4 border-white shadow-md"
                  loading="eager"
                />
              </div>

              {/* User Info */}
              <div>
                <Card.Meta
                  title={
                    <span className="text-lg font-semibold text-gray-800">
                      {item.fullname}
                    </span>
                  }
                  description={
                    <span className="text-sm text-gray-500">
                      {item.email}
                    </span>
                  }
                />
              </div>

              {/* Date */}
              <span className="text-xs text-gray-400 tracking-wide">
                Joined · {moment(item.createdAt).format("MMM D, YYYY • hh:mm:ss A")}
              </span>

            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Users