import Image from 'next/image'

const Logo = () => {
  return (
    <Image 
        src="/images/logo (2).png"
        width={130}
        height={50}
        alt="logo"
        priority
        loading='eager'
        style={{width: 'auto', height: 'auto'}}
    />
  )
}

export default Logo