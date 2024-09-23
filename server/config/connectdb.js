import mongoose from "mongoose"
const uri = "mongodb://localhost:27017/project1"

const connectDb = ()=>{

    return mongoose.connect(uri).then(()=>{
     console.log("db connected")

    }).catch((error)=>{

        console.log("connection failed")
    })


}


export default connectDb