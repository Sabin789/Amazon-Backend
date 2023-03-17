import  Express  from "express";
import listEndpoints from "express-list-endpoints";
import ProductsRouter from "../Api/products/index.js";
import { PublicFolderPath } from "./lib/fs-tools.js";
import cors from 'cors';
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandlers.js";
import ReviewsRouter from "./reviews/index.js";
import ProductFileRouter from "./ProductFile/index.js";
import createHttpError from "http-errors";
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs";
import { dirname,join } from "path";
import mongoose from "mongoose";

// const yamlFile=yaml.load(join(process.cwd(), "./src/docs/apiDocs.yml"))



const server=Express()
const port=process.env.PORT  
server.use(Express.json())
server.use(Express.static(PublicFolderPath))

const whiteList=[process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpt={
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whiteList.indexOf(currentOrigin) !== -1) {
       
        corsNext(null, true)
      } else {
   
        corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
      }
    },
  }

server.use(
    cors(corsOpt)
  )

server.use("/products",ProductsRouter)
server.use("/products",ReviewsRouter)
server.use("/products",ProductFileRouter)
// server.use("docs", swaggerUi.serve,swaggerUi.setup(yamlFile))


server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on("connected",()=>{
    console.log("succesfully connected to mongo")
})

server.listen(port,()=>{
    // console.table(listEndpoints(server))
    console.log(process.env.FE_DEV_URL)
    console.log(`Server is listening on port ${port}`)
})
