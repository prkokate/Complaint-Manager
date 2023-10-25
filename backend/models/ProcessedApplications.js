require('dotenv').config();
const MongoURI=process.env.MongoURI;
const mongoose = require('mongoose');
const {Schema} = mongoose;

let ProcessedApplicationSchema = new Schema({

    aaplication : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'application'
    },
  
    title : {
        type :String ,
        default : 'Application',
        required  :true
    },

    review:{
    type : String,
    required : true
   },

   Status :{
    type : String,
    default : 'Processed',
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

module.exports = mongoose.model('processed-applications',ProcessedApplicationSchema); 