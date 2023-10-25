const mongoose=require('mongoose');
const{Schema}=mongoose;
// const bcrypt = require("bcryptjs");
let userSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    rollno:{
        type : Number,
        require : true
    },
    clgid:{
        type : String,
        require : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type:String ,
        required:true
    }

});

module.exports=mongoose.model('user',userSchema);