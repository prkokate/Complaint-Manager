require('dotenv').config();
const MongoURI=process.env.MongoURI;
const mongoose = require('mongoose');
const {Schema} = mongoose;

let AdminSchema = new Schema({
    Admin_id : {
        type: String,
        required:[true,'Admin id is required']
    },
    email :{
        type:String,
        required:true
    },
    name :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    designation :{
        type : String,
        required : true
    },
    pending : {
        type : Number,
        default : 0,
        required : true
    }


})

module.exports=mongoose.model('admin',AdminSchema);