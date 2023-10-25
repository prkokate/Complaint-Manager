require('dotenv').config();
const MongoURI=process.env.MongoURI;
const mongoose = require('mongoose');
const {Schema} = mongoose;

let ApplicationSchema = new Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
   name:{
    type : String,
    required : true
   },
   Admin_id : {
       type :String,
       required :true
   },

   Admin_name:{
    type : String,
    required : true
   },

    title : {
        type :String ,
        default : 'Application',
        required  :true
    },

    description:{
    type : String,
    required : true
   },

   Status :{
    type : String,
    default : 'Pending',
    required : true
   },
   Type:{
    type : String,
    default : 'application',
    required : true
   },
   Date:{
       type:Date,
       default :Date.now
   }
  
})

module.exports = mongoose.model('applications',ApplicationSchema); 