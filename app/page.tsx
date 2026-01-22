export const dynamic = 'force-dynamic'

import Product from "@/components/Product";

export const revalidate =  86400

const HomeRouter = async() => {
const productRes = await fetch(`${process.env.SERVER}/api/product`)
if (!productRes.ok) {
  throw new Error("Failed to fetch products")
}
const products = await productRes.json()
  
  return (<Product data={products}/> );
}

export default HomeRouter;
