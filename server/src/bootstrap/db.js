import mongoose from "mongoose";
import ENV from "../config/env.js";

async function connectDB(){
    try{
        await mongoose.connect(ENV.MONGOBD_URI)

        console.log(`MongoDB connected`);
        
    }catch(err){
        console.log("MongoDB error = ",err);
        
    }
}

export default connectDB;