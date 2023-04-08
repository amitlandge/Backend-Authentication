const mongoose=require("mongoose");
const MONGO_URL=process.env.MONGO_URL
exports.connect=()=>{
    mongoose.connect(MONGO_URL).then(()=>{
        console.log("DataBase Connect Succesfully")
    }).catch(()=>{
        console.log("Database Failed")
    })
}