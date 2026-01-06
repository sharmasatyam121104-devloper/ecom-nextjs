const getPrice = (price: number,discount:number)=>{
    const discountPrice = (price*discount)/100
    return price - discountPrice
}
export default getPrice