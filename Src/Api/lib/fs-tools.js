import fs from "fs-extra"
import { fileURLToPath } from "url"; 
import { dirname,join } from "path";
import { createReadStream, writeFileSync } from "fs";

const {readJSON,writeJSON}=fs

const dataFolderPath=join(dirname(fileURLToPath(import.meta.url)),"../data")
const productsToJson=join(dataFolderPath,"products.json")
const ReviewsToJson=join(dataFolderPath,"Review.json")


export const PublicFolderPath=join((process.cwd()),"./Public/img/product")
export const getProducts=()=>readJSON(productsToJson)
export const writeProduct=arrayOfProducts=>writeJSON(productsToJson,arrayOfProducts)
export const getReviews=()=>readJSON(ReviewsToJson)
export const writeReview=arrayOfReviews=>writeJSON(ReviewsToJson,arrayOfReviews)
export const SaveProductPicture= (fileName,fileContentAsBuffer)=>writeFileSync(join(PublicFolderPath, fileName), fileContentAsBuffer)
export const  getReadableStream=()=>createReadStream(productsToJson)