require('dotenv').config();
const express= require('express');
const mongoose=require('mongoose');
const PORT=process.env.PORT||5000
const app=express();
const authRoute=require("./routes/authentication");
const codeRoute=require("./routes/codeRunner");

mongoose.connect("mongodb://127.0.0.1:27017/judgeDB", {useNewUrlParser: true});

app.use("/auth",authRoute);
app.use("/code",codeRoute)

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})