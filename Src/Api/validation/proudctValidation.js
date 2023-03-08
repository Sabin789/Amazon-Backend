import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const ProudctSchema={
    category: {
        in: ["body"],
        
        isString: {
          errorMessage: "Category is a mandatory field and needs to be a string!",
        }
      },
  name:{
  in:["body"],
  isString: {
    errorMessage: "Name is a mandatory field and needs to be a string!",
  }
},
 description:{
    in:["body"],
    isString:{
        errorMessage: "Description is a mandatory field and needs to be a string!",

    }
 },
 brand:{
    in:["body"],
    
    isString:{
        errorMessage: "Brand is a mandatory field and needs to be a string!",

    }
 },
 price:{
    in:["body"],
    isNumeric:{
        errorMessage: "Price is a mandatory field and needs to be a Number!",

    }
 },
 imageUrl:{
    in:["body"],
 }


}

export const checkProductSchema=checkSchema(ProudctSchema)

export const triggerBadRequest=(req,res,next)=>{
    const errors=validationResult(req)
    console.log(errors.array())
    if (errors.isEmpty()) {
        
        next()
      } else {
   
        next(createHttpError(400, "Errors during product validation", { errorsList: errors.array() }))
      }
}
