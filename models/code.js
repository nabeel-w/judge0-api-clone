const mongoose = require('mongoose');

const codeSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    code:{
        type:String,
        required:true
    },
    format:{
        type:String,
        required:true
    }
});
const Code=mongoose.model('Code',codeSchema);

module.exports= Code;