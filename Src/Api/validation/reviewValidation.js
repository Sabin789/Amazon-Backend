import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const ReviewSchema={
    comment:{
        in:["body"],
        isString:{
            errorMessage:"Comment is mandatory field and needs to be a string"
        }
    },
    rate:{
        in:["body"],
        
        isNumeric:
            {
            errorMessage:"Rate is a mandatory field and needs to be a number from 0-5"
        }
      
    }
}

export const checkReviewSchema=checkSchema(ReviewSchema)
