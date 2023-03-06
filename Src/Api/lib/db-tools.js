import uniqId from "uniqid"
import { getProducts, writeProduct } from "../lib/fs-tools.js";
import createHttpError from "http-errors"


export const saveNewProduct=async newProductData=>{
    const products= await getProducts()
    const newProduct={...newProductData,_id:uniqId(),createdAt:new Date(),updatedAt:new Date(),imageUrl:""}

        products.push(newProduct)
        await writeProduct(products)
}

export const getProductById=async productId=>{

    const products= await getProducts()

    const singleProduct= products.find(p=>p._id===productId)
   
    if(singleProduct){
        console.log(productId)
        console.log(singleProduct)
return singleProduct

    }else{
      return createHttpError(404, `Product with id ${req.params.productId} not found!`)
    }
}