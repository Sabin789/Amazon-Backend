import Express from "express";
import multer from "multer"
import { extname } from "path";
import createHttpError from "http-errors"
import { getProducts, getReadableStream, SaveProductPicture, writeProduct} from "../lib/fs-tools.js";

import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

import { pipeline } from "stream";
import {createGzip} from "zlib"
import { getPDFReadableStream } from "../lib/pdf-tools.js";
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
      const products= await getProducts()
      const singleProduct= products.find(p=>p._id===req.params.productId)


      if(singleProduct){
    //       const originalFileExt=extname(req.file.originalname)
    //      const fileName=req.params.productId+originalFileExt
  
    //   SaveProductPicture(fileName,req.file.buffer)
      
     singleProduct.imageUrl=req.file.path
  
     await writeProduct(products)
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
      const products=await getProducts()
      const singleProduct= products.find(p=>p._id===req.params.productId)
      if(singleProduct){
        res.setHeader("Content-Disposition","attachment; filename=products.pdf")
        const source=getPDFReadableStream(singleProduct)
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
export default ProductFileRouter