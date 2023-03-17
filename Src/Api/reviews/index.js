import  Express  from "express";
import uniqId from "uniqid"
import { checkReviewSchema } from "../validation/reviewValidation.js";
import { getProducts, getReviews, writeReview } from "../lib/fs-tools.js";
import createHttpError from "http-errors"
import {  triggerBadRequest } from "../validation/proudctValidation.js";
import productSchema from "../validation/productModel.js"
const ReviewsRouter=Express.Router()

ReviewsRouter.post("/:productId/reviews",checkReviewSchema,triggerBadRequest,async(req,res,next)=>{
    try{

        const newReview={...req.body,createdAt:new Date(),updatedAt:new Date()}
        if(newReview){
         const updatedProduct=await productSchema.findByIdAndUpdate(
            req.params.productId,
            {$push:{reviews:newReview}},
            {new:true,runValidators:true}
         )
         if(updatedProduct){
            res.send(updatedProduct)
         }
        }
    }catch(err){
        next(err)
    }
})

ReviewsRouter.get("/:productId/reviews",async(req,res,next)=>{
    try{
   
        const product=await productSchema.findById(req.params.productId)
        if(product){
        const reviews=product.reviews
        res.send(reviews)
        }else{
            next(createHttpError(404, `Product with id ${req.body.productId} not found!`))

        }
      
    }catch(err){
        next(err)
    }
})

ReviewsRouter.get("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        
        const product=await productSchema.findById(req.params.productId)
        if(product){
        const review=product.reviews.find((r => r._id.toString() === req.params.reviewId))
        if(review){
            res.send(review)
        }else{
            next(createHttpError(404, `Review with id ${req.body.reviewId} not found!`))

        }
        }else{
            next(createHttpError(404, `Product with id ${req.body.productId} not found!`))

        }
    }catch(err){
        next(err)
    }
})


ReviewsRouter.put("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        const product=await productSchema.findById(req.params.productId)
        if(product){
      
            let index= product.reviews.findIndex(comment => comment._id.toString() === req.params.reviewId)
         
            if(index!==-1){
                product.reviews[index]={...product.reviews[index],_id: req.params.reviewId,...req.body}
                await product.save()
                res.send(product)
            }else{
              next(createHttpError(404, `Comment with id ${req.body.reviewId} not found!`))
            }
        }else{
            next(createHttpError(404, `product with id ${req.body.productId} not found!`))
    
        }


    }catch(err){
        next(err)
    }
})


ReviewsRouter.delete("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        const updatedProduct = await productSchema.findByIdAndUpdate(
            req.params.productId, // WHO
            { $pull: { reviews: { _id: req.params.reviewId } } }, // HOW
            { new: true, runValidators: true } // OPTIONS
          )
          if (updatedProduct) {
            res.send(updatedProduct)
          } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
          }
    }catch(err){
        next(err)
    }
})


export default ReviewsRouter