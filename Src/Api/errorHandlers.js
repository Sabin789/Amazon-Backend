import mongoose from "mongoose"

export const badRequestHandler=(err,req,res,next)=>{
    if(err.status===400||err instanceof mongoose.Error.ValidationError){
      res.status(400).send({succes:false,message: err.message, errorsList: err.errorsList? err.errorsList.map(e => e.msg):"" })
    }else if(err instanceof mongoose.Error.CastError ){
      res.status(400).send({message:"You sent a wrong id"})
    }else{
        next(err)
    }
}

export const notFoundHandler=(err,req,res,next)=>{
    if(err.status===404){
        res.status(404).send({succes:false,message:err.message})
    }else{
        next(err)
      }
}

export const genericErrorHandler=(err,req,res,next)=>{
    console.log("ERROR:", err)
    res.status(500).send({succes:false,message:"There was an issue on our side",})
}