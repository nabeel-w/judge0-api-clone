require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User=require("../models/users");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const tokenBlacklist = new Set();

router.use(bodyParser.urlencoded({extended: true}));

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader

    if (!token||tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "User Token doesn't exist." }); // Unauthorized
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "User Token expired." }); // Forbidden
        }
        req.decoded = decoded;
        next();
    });
}

router.post('/log', async(req, res) => {
    const email= req.body.email;
    const password = req.body.password;
    const userFound=await User.findOne({email:email});
    if(!userFound){
        res.status(404).json({message:"User doesn't exist"});
    }else{
        const success= await bcrypt.compare(password, userFound.password);
        if(!success){
            res.status(401).json({message:"Wrong credentials"});
        }else{
        const id= userFound._id;
        const expiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);//Token expires in one week
        const token = jwt.sign({ id }, secretKey, { expiresIn: expiration });
        res.status(200).json({token})
        }
    }
});
  
router.post('/new', async (req, res) => {
    const name= req.body.uname;
    const email= req.body.email;
    const password= req.body.password;

    const userFound= await User.findOne({email:email});//Cheaking if the user already exists 
    //console.log(userFound);
    if(userFound){
        res.status(409).json({message:"This email is already in use."});
    }else{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
    const user= new User({
        name:name,
        email: email,
        password: hashedPassword
    });
    await user.save();
    res.status(200).json({message: "User created"});
}
});

router.post("/token",verifyToken,(req,res)=>{
    res.status(200).json({message:"Valid Token"});
})

router.post("/logout",(req,res)=>{
    const token = req.headers.authorization;
    tokenBlacklist.add(token);
    res.status(200).json({ message: 'Token revoked successfully' });
})

module.exports = router;