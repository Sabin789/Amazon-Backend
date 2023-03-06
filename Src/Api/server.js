import  Express  from "express";
import listEndpoints from "express-list-endpoints";
import ProductsRouter from "../Api/products/index.js";
import { PublicFolderPath } from "./lib/fs-tools.js";
import cors from 'cors';
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandlers.js";
import ReviewsRouter from "./reviews/index.js";
import ProductFileRouter from "./ProductFile/index.js";
import createHttpError from "http-errors";

const server=Express()
const port=process.env.PORT || 3003
server.use(Express.json())
server.use(Express.static(PublicFolderPath))

const whiteList=[process.env.FE]

server.use(
    cors({
      origin: (currentOrigin, corsNext) => {
        if (!currentOrigin || whiteList.indexOf(currentOrigin) !== -1) {
         
          corsNext(null, true)
        } else {
     
          corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
        }
      },
    })
  )

server.use("/products",ProductsRouter)
server.use("/products",ReviewsRouter)
server.use("/products",ProductFileRouter)


server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)


server.listen(port,()=>{
    // console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
})
