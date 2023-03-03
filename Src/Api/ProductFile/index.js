import Express from "express";
import multer from "multer"
import { extname } from "path";
import createHttpError from "http-errors"
import { getProducts, SaveProductPicture, writeProduct} from "../lib/fs-tools.js";
import { fileURLToPath } from "url";


const ProductFileRouter=Express.Router()

ProductFileRouter.post("/:productId/upload", multer().single("imageUrl"),async(req,res,next)=>{
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