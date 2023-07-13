require('dotenv').config();
const express= require('express');
const cors = require('cors');
const mongoose=require('mongoose');
const authRoute=require("./routes/authentication");
const codeRoute=require("./routes/codeRunner");

const PORT=process.env.PORT||5000;

const app=express();
//const corsOptions = {origin: ['http://localhost:3000/']};
app.use(cors( {origin: ['http://localhost:3000']}));

mongoose.connect("mongodb://127.0.0.1:27017/judgeDB", {useNewUrlParser: true});

app.use("/auth",authRoute);
app.use("/code",codeRoute);

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
});