import  Express  from "express";
import uniqId from "uniqid"
import { getProducts, writeProduct } from "../lib/fs-tools.js";
import createHttpError from "http-errors"
import { checkProductSchema, triggerBadRequest } from "../validation/proudctValidation.js";
import { saveNewProduct } from "../lib/db-tools.js";


const ProductsRouter=Express.Router()




ProductsRouter.post("/",checkProductSchema,triggerBadRequest,async(req,res,next)=>{
   
   try{
await saveNewProduct(req.body)

res.status(201).send({newProd:req.body})
}catch(err){
    next(err)
   }
})


ProductsRouter.get("/",async(req,res,next)=>{
 
    try{

        const products= await getProducts()
        if(req.query && req.query.category){
            const filteredProducts=products.filter(p=>p.category===req.query.category)
       
            res.send(filteredProducts)
        }else{
           
        res.send(products)
        }
    }catch(err){
        next(err)
    }
})


ProductsRouter.get("/:productId",async(req,res,next)=>{
  
    try{
        const products= await getProducts()
        const singleProduct= products.find(p=>p._id===req.params.productId)
        if(singleProduct){
        res.send(singleProduct)
        }else{
            res.send((createHttpError(404, `Product with id ${req.params.productId} not found!`))) 
        }
    }catch(err){
        res.send(next(err))
    }
})


ProductsRouter.put("/:productId",async(req,res,next)=>{
   
    try{
        const products= await getProducts()
        const index=products.findIndex(p=>p._id===req.params.productId)
        const currentProduct=products[index]
        const updated={...currentProduct,...req.body,updatedAt:new Date()}
        products[index]=updated
        await writeProduct(products)
        res.send(updated)
     
    }catch(err){
        next(err)
    }
})


ProductsRouter.delete("/:productId",async(req,res,next)=>{
   
    try{
        const products= await getProducts()
        const remaining=products.filter(p=>p._id!==req.params.productId)
        await writeProduct(remaining)
        res.status(204).send()

    }catch(err){  
          next(err)
        
    }
})



export default ProductsRouter