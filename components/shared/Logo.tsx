import Image from 'next/image'

const Logo = () => {
  return (
    <Image 
        src="/images/logo.png"
        width={120}
        height={50}
        alt="logo"
        priority
        style={{width: 'auto', height: 'auto'}}
    />
  )
}

export default Logo