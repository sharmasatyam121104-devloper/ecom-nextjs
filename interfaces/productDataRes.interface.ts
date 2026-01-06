interface ProductInterface {
  _id:string
  title: string
  description: string
  price: number
  discount?: number
  slug?:string
  image:string
  quantity:number
}

interface ProductsResponseInterface {
  products: ProductInterface[]
  totalNoProduct: number
}

export default ProductsResponseInterface