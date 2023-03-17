import Express from "express";
import multer from "multer"
import { extname } from "path";
import createHttpError from "http-errors"
import { getProducts, getReadableStream, SaveProductPicture, writeProduct} from "../lib/fs-tools.js";
import { Transform } from "@json2csv/node"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import productSchema from "../validation/productModel.js"

import { pipeline } from "stream";
import {createGzip} from "zlib"
import { getPDFReadableStream } from "../lib/pdf-tools.js";
import { promisify } from "util";
const ProductFileRouter=Express.Router()



const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, // cloudinary is going to search for smth in .env vars called process.env.CLOUDINARY_URL
      params: {
        folder: "fs0522/users",
      },
    }),
  }).single("imageUrl")



ProductFileRouter.post("/:productId/upload", cloudinaryUploader,async(req,res,next)=>{

    try{
      const product=await productSchema.findById(req.params.productId)


      if(product){
        product.imageUrl=req.file.path
     
        product.save()
            res.send({message:"file Uploaded"})
         }else{
   
           res.status(400)
         }
    }catch(err){
       
     next(err)
    }
  })
ProductFileRouter.get("/none/upload",(req,res,next)=>{
    try{
        res.setHeader("Content-Disposition","attachment; filename=products.json.gz")
        const source=getReadableStream()
        const destination=res
        const transform=createGzip()
        pipeline(source,transform,destination,err =>{
            if(err){console.log(err)}else{
                console.log("Compressed json")
            }
        })
    }catch(err){
        next(err)
    }
})


ProductFileRouter.get("/:productId/pdf",async (req,res,next)=>{
    try{
      const product=await productSchema.findById(req.params.productId)
      if(product){
        res.setHeader("Content-Disposition","attachment; filename=products.pdf")
        const source=getPDFReadableStream(product)
        const destination=res

        pipeline(source,destination,err =>{
            if(err){console.log(err)}else{
                console.log("PDF")
            }
        })
      }
    }catch(err){
        next(err)
    }
})


ProductFileRouter.get("/all/csv",async (req,res,next)=>{
  try{
 const products=await getProducts()
   
    res.setHeader("Content-Disposition","attachment; filename=products.csv")
 
    const source=getPDFReadableStream(products)
 res.send(products)
    const transform=new Transform({fields:["name","category","price"]})
    const destination=res
    pipeline(source,transform,destination,err=>{

      if(err)console.log(err)
      console.log("succes")
    })
  }catch(err){

  }
})
export default ProductFileRouter