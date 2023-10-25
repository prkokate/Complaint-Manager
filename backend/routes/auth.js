require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
const User=require('../models/User');
const Admin=require('../models/Admin');
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const fetchAdmin = require('../middleware/fetchAdmin');


let success=false;


router.post('/Sign-up',[
    body('name').isLength({min:3}),
    body('clgid').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:6}),
    body('rollno').isLength(4)
],async(req,res)=>{
    console.log("sign up");

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    try {
    let user = await User.findOne({name:req.body.name,id:req.body.id});
    if(user){
       return res.status(400).json({success,error : "User already exists!"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password : secPass,
        clgid : req.body.clgid,
        rollno : req.body.rollno
    });

    const data={
        user :{
            id : user.id,
            email : user.email,
            name : user.name,
            clgid : user.clgid
        }
    }

    const jwtData=jwt.sign(data,JWT_SECRET);
    //console.log(jwtData);
    success=true;
    res.json({success,"status":"User created succesfully!"});
}
catch(err){
    console.log(`Error in creating the new user ${err}`);
    success=false;
    res.status(500).send(success,"Some error occurred!");
}
})



router.post('/login',[
    
    body('email').isEmail(),
    body('password').isLength({min:6}),
],async(req,res)=>{
    console.log("Login");

    const {email,password}=req.body;

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }

    try{
        let user = await User.findOne({email:req.body.email});
        if(!user) return  res.status(401).json({"message" :"User does not exist"});

        const passCompare = await bcrypt.compare(password,user.password);
        if(!passCompare){
            return res.status(401).json({"message" :"Invalid credentials"});
        }


        const data={
            user :{
                id : user.id,
                email : user.email,
                name : user.name,
                clgid : user.clgid
            }
        }

        const authtoken=jwt.sign(data,JWT_SECRET);

        success=true;
        res.json({success,Token:authtoken});
    }
    catch(err){
        console.log(err);
        success=false;
        res.send({success,error:err});        
    }
})



router.post('/my-profile', fetchuser,async(req,res)=>{
    try{
        console.log('my-profile')

        const UserId=req.user.id;
        const user = await User.findById(UserId).select('-password'); 
        res.send(user);
    }
    catch(err){
        res.status(400).send({error:err});
    }

})



router.post('/Create-admin',[
    body('name').isLength({min:3}),
    body('Admin_id').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:6}),
    body('designation').isLength(2)
],async(req,res)=>{
    console.log("Create admin");

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    try {
    let admin = await Admin.findOne({name:req.body.name,id:req.body.id});
    if(admin){
       return res.status(400).json({success,error : "User already exists!"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    admin = await Admin.create({
        Admin_id : req.body.Admin_id,
        name: req.body.name,
        email: req.body.email,
        password : secPass,
        designation : req.body.designation,
    });

    const data={
        admin :{
            id : admin.id,
            Admin_id : admin.Admin_id,
            email : admin.email,
            name : admin.name,
            designation : admin.designation
        }
    }

    const jwtData=jwt.sign(data,JWT_SECRET);
    //console.log(jwtData);
    success=true;
    res.json({success,"status":"Admin created succesfully!"});
}
catch(err){
    console.log(`Error in creating the new user ${err}`);
    success=false;
    res.status(500).send(success,"Some error occurred!");
}
})



router.post('/admin-login',[
    body('email').isEmail(),
    body('password').isLength({min:6}),
],async(req,res)=>{
    console.log("Admin Login");

    const {email,password}=req.body;

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }

    try{
        let admin = await Admin.findOne({email:req.body.email});
        if(!admin) return  res.status(401).json({"message" :"Admin does not exist"});

        const passCompare = await bcrypt.compare(password,admin.password);
        if(!passCompare){
            return res.status(401).json({"message" :"Invalid credentials"});
        }


        const data={
            admin :{
                id : admin.id,
                Admin_id : admin.Admin_id,
                email : admin.email,
                name : admin.name,
                designation : admin.designation
            }
        }

        const authtoken=jwt.sign(data,JWT_SECRET);

        success=true;
        res.json({success,Token:authtoken});
    }
    catch(err){
        console.log(err);
        success=false;
        res.send({success,error:err});        
    }
})



router.post('/Admin-profile', fetchAdmin,async(req,res)=>{
    try{
        console.log('Admin-profile')

        const AdminId=req.admin.id;
        const admin = await Admin.findById(AdminId).select('-password'); 
        res.send(admin);
    }
    catch(err){
        res.status(400).send({error:err});
    }

})


module.exports=router;