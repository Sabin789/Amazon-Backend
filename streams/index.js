import request from "request"

import {pipeline} from "stream"
import {join} from "path"
import {create6zip} from "zlib"

let url

let destination=fs.createdStream(join(pcrocess.cwd()),"./streams/data.json")

let source=request.get(url)

const transform=create6zip()
pipeline(source,destination,err=>{
  if(err){console.log(err)}else{
    console.log("stream ended succesfully")
  }
})