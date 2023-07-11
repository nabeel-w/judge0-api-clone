require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User=require("../models/users");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

router.use(bodyParser.urlencoded({extended: true}));

router.post('/', async(req, res) => {
    const email= req.body.email;
    const password = req.body.password;
    const userFound=await User.findOne({email:email});
    if(!userFound){
        res.status(404).json({message:"User doesn't exist"});
    }
    const success= await bcrypt.compare(password, userFound.password);
    if(!success){
        res.status(401).json({message:"Wrong credentials"});
    }
    const id= userFound._id;
    const expiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);//Token expires in one week
    const token = jwt.sign({ id }, secretKey, { expiresIn: expiration });
    res.status(200).json({token})
});
  
router.post('/new', async (req, res) => {
    const name= req.body.uname;
    const email= req.body.email;
    const password= req.body.password;

    const userFound= await User.findOne({email:email});//Cheaking if the user already exists 
    console.log(userFound);
    if(userFound){
        res.status(409).json({message:"This email is already in use."});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
    const user= new User({
        name:name,
        email: email,
        password: hashedPassword
    });
    await user.save();
    res.status(200).json({message: "User created"});
});



module.exports = router;