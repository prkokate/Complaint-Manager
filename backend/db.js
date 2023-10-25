require('dotenv').config()
const mongoose=require('mongoose');

const MongoURI=process.env.MongoURI;

const MongoConnect=()=>{
    mongoose.connect(MongoURI).then(()=>{
        console.log('connected to mongoose!');
    })
}

module.exports=MongoConnect;