import  Express  from "express";
import uniqId from "uniqid"
import { getProducts, writeProduct } from "../lib/fs-tools.js";
import createHttpError from "http-errors"
import { checkProductSchema, triggerBadRequest } from "../validation/proudctValidation.js";
import { saveNewProduct } from "../lib/db-tools.js";
import productSchema from "../validation/productModel.js"
import q2m from "query-to-mongo"

const ProductsRouter=Express.Router()




ProductsRouter.post("/",async(req,res,next)=>{
   
   try{
   const newProduct=new productSchema(req.body)

   const {_id}=await newProduct.save()
   res.status(201).send({_id:_id})
}catch(err){
    next(err)
   }
})


ProductsRouter.get("/",async(req,res,next)=>{
    const whiteList=[process.env.BE_DEV_URL, process.env.BE_PROD_URL]

    try{
        const url = process.env.BE_PROD_URL
        const mongoQuery = q2m(req.query)
        if(whiteList.includes(url)){
            const allProducts = await productSchema.find(mongoQuery.criteria, mongoQuery.options.fields)
            .limit(mongoQuery.options.limit)
            .skip(mongoQuery.options.skip)
            .sort(mongoQuery.options.sort)
            const total = await productSchema.countDocuments(mongoQuery.criteria)

            res.send({
                links: mongoQuery.links(url, total),
                total,
                numberOfPages: Math.ceil(total / mongoQuery.options.limit),
                allProducts,
              })
// const products= await productSchema.find()
// res.send(products)
        }
    }catch(err){
        next(err)
    }
})


ProductsRouter.get("/:productId",async(req,res,next)=>{
  
    try{
        const product=await productSchema.findById(req.params.productId)
        if(product){
     res.send(product)
        }else{
         res.send((createHttpError(404, `Product with id ${req.params.productId} not found!`))) 
        }
    }catch(err){
        res.send(next(err))
    }
})


ProductsRouter.put("/:productId",async(req,res,next)=>{
   
    try{
        let updated =await productSchema.findByIdAndUpdate(
            req.params.productId,
            req.body,
            {new:true,runValidators:true}
        )
        if(updated){
            res.send(updated)
        }else{
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        
        }
    }catch(err){
        next(err)
    }
})


ProductsRouter.delete("/:productId",async(req,res,next)=>{
   
    try{
        const deleted= await productSchema.findByIdAndDelete(req.params.productId)
        if(deleted){
         res.status(204).send()
        }else{
     
        }

    }catch(err){  
          next(err)
        
    }
})



export default ProductsRouter