import  Express  from "express";
import uniqId from "uniqid"
import { checkReviewSchema } from "../validation/reviewValidation.js";
import { getProducts, getReviews, writeReview } from "../lib/fs-tools.js";
import createHttpError from "http-errors"
import {  triggerBadRequest } from "../validation/proudctValidation.js";
const ReviewsRouter=Express.Router()

ReviewsRouter.post("/:productId/reviews",checkReviewSchema,triggerBadRequest,async(req,res,next)=>{
    try{
        const reviews=await getReviews()
        const newReview={...req.body,productId:req.params.productId,_id:uniqId(),createdAt:new Date(),updatedAt:new Date()}
        if(newReview){
         reviews.push(newReview)
         await writeReview(reviews)
         res.status(201).send({_id:newReview._id})
        }
    }catch(err){
        next(err)
    }
})

ReviewsRouter.get("/:productId/reviews",async(req,res,next)=>{
    try{
        const products=await getProducts()
        const reviews=await getReviews()
        const singleProduct= products.find(p=>p._id===req.params.productId)
      const reviewsById=reviews.filter(r=>r.productId===singleProduct._id)
       
        res.send(reviewsById)
    }catch(err){
        next(err)
    }
})

ReviewsRouter.get("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        const products=await getProducts()
        const reviews=await getReviews()
        
        const singleProduct= products.find(p=>p._id===req.params.productId)
        const reviewsById=reviews.filter(r=>r.productId===singleProduct._id)
        const sinlgeReview=reviewsById.find(r=>r._id===req.params.reviewId)

        if(sinlgeReview){
        res.send(sinlgeReview)
        }else{
            res.send((createHttpError(404, `Review with id ${req.params.productId} not found!`))) 
        }
    }catch(err){
        next(err)
    }
})


ReviewsRouter.put("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        const reviews=await getReviews()

        // const sinlgeReview=reviews.find(r=>r._id===req.params.reviewId)
        const products=await getProducts()
        const index=reviews.findIndex(i=>i._id===req.params.reviewId)
        const singleProduct= products.find(p=>p._id===req.params.productId)
        const reviewsById=reviews.filter(r=>r.productId===singleProduct._id)
        const currentReview=reviewsById[index]
        const updated={...currentReview,...req.body,updatedAt:new Date()}
        reviewsById[index]=updated
        await writeReview(reviewsById)
        res.send(updated)


    }catch(err){
        next(err)
    }
})


ReviewsRouter.delete("/:productId/reviews/:reviewId",async(req,res,next)=>{
    try{
        const products=await getProducts()
        const reviews=await getReviews()
        const singleProduct= products.find(p=>p._id===req.params.productId)
        const reviewsById=reviews.filter(r=>r.productId===singleProduct._id)
        const remaining=reviewsById.filter(r=>r._id!==req.params.reviewId)
        if(remaining){
        await writeReview(remaining)
        res.status(204).send()
        }
    }catch(err){
        next(err)
    }
})


export default ReviewsRouter