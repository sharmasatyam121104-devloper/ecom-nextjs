'use client'
import { Card, Skeleton } from 'antd'
import Image from 'next/image'


const Users = () => {
  return (
    <div className='grid grid-cols-4 gap-8'>
      <Skeleton active className='col-span-4'/>
      {
        Array(16).fill(0).map((item,index)=>(
          <Card key={index} hoverable>
            <div className='flex flex-col items-center gap-6'>
              <Image 
                      src="/images/blank.jpg"
                      width={100}
                      height={100}
                      alt={`avt${index}`}
                      objectFit='cover'
                      style={{width: 'auto', height: 'auto'}}
                      className='rounded-full'
                  />
                  <Card.Meta
                  title="User Name"
                  description="user@gamil.com"
                  />
                  <label className='text-gray-500 font-medium'>Jan 3,2022</label>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Users