import mongoose, { model } from "mongoose"


const {Schema}=mongoose


const productSchema=new Schema({
    name:{ type: String, required: true , minLength: 3, maxLength: 12},
    description:{type:String,required:true,minLength: 3, maxLength: 12},
    brand:{type:String,required:true,minLength: 3, maxLength: 12},
    imageUrl:{type:String,default:""},
    price:{type:Number,required:true},
    category:{type:String,required:true,minLength: 3, maxLength: 12},
    reviews:[{
        comment:{ type: String, required: true , minLength: 3, maxLength: 12},
        rate:{type:Number,min:1,max:5,required:true},
        createdAt:{type:Date},
        updatedAt:{type:Date}
    }
    ]
},{timestamps:true})




export default model("Product", productSchema)