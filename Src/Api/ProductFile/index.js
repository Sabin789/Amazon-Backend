import Express from "express";
import multer from "multer"
import { extname } from "path";
import createHttpError from "http-errors"
import { getProducts, SaveProductPicture, writeProduct} from "../lib/fs-tools.js";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

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
          const originalFileExt=extname(req.file.originalname)
         const fileName=req.params.productId+originalFileExt
  
      SaveProductPicture(fileName,req.file.buffer)
      
     singleProduct.imageUrl=`http://localhost:3001/Public/img/product/${fileName}`
     await writeProduct(products)
         res.send({message:"file Uploaded"})
      }else{
        res.status(400)
      }
    }catch(err){
     next(err)
    }
  })


export default ProductFileRouter