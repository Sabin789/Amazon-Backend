import  Express  from "express";
import listEndpoints from "express-list-endpoints";
import ProductsRouter from "../Api/products/index.js";
import { PublicFolderPath } from "./lib/fs-tools.js";
import cors from 'cors';
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandlers.js";
import ReviewsRouter from "./reviews/index.js";
import ProductFileRouter from "./ProductFile/index.js";

const server=Express()
const port=3001
server.use(Express.json())
server.use(Express.static(PublicFolderPath))
server.use(cors())

server.use("/products",ProductsRouter)
server.use("/products",ReviewsRouter)
server.use("/products",ProductFileRouter)


server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)


server.listen(port,()=>{
    console.table(listEndpoints(server))
    console.log(`Server is lidtening on port ${port}`)
})
