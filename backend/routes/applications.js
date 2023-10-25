require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
const Application=require('../models/Applications');
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const fetchAdmin = require('../middleware/fetchAdmin');
const Admin = require('../models/Admin');
const ProcessedApplication = require('../models/ProcessedApplications');


router.get('/my-applications',fetchuser,async(req,res)=>{
        try{
            const applications=await Application.find({user: req.user.id});
            res.json(applications);
        }

        catch(err){
            res.status(400).send({error : "Couldn't fetch your applications"});
        }
})


router.post('/create-application',fetchuser, [
    body('title','Enter a valid title').isLength({min :3}),
    body('description','Content should have atleast 5 characters!').isLength({min:5})
], async (req,res)=>{
   
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

   try {
    const {title,description,Type,Admin_id}=req.body;

    const name = req.user.name;
    const clgid=req.user.clgid;
    const Adminn=await Admin.find({Admin_id : Admin_id});
    const Admin_name=Adminn[0].name;
    // console.log(Admin_name);

    if(!Admin_name){
        return res.status(400).send({error:"Invalid admin!"});
    }


    

    const application =  new Application({
        title, description,Type, user:req.user.id,name,Admin_id,Admin_name
    })

    let NewAdmin=Adminn[0];
    NewAdmin.pending+=1;

    const adMin= await Admin.findByIdAndUpdate(Adminn[0]._id, {$set:NewAdmin},{new :true});
    console.log(adMin);

    const savedApp = await application.save();

    res.json(savedApp);
}
catch(error){
    console.log(error);
    res.status(400).json({error:'Internal server errorr'})
}
})


// router.delete('/delete-application/:id',fetchuser,async(req,res)=>{

// })


router.get('/All-applications',fetchAdmin,async(req,res)=>{
    try{
        const applications=await Application.find({Admin_id: req.admin.Admin_id});
        // console.log(req.admin);
        res.json(applications);
    }

    catch(err){
        res.status(400).send({error : "Couldn't fetch your applications"});
    }
})


router.post('/review-application/:id',fetchAdmin, async(req,res)=>{
    try {

        const app=await Application.findById(req.params.id);
        if(!app){
           return res.status(401).send({error : "No application to review"});
        }

        if(app.Admin_id!==req.admin.Admin_id){
            return res.status(403).send({error:"You are not authorized"})
        }
        const proc=ProcessedApplication.find({application:req.params.id});
        if(proc){
            return res.status(400).send({error : `${app.Type} already reviewed!`});
        }
        const {Status,review}=req.body;
        let {title,Type}=app;
        const processedApp=new ProcessedApplication({
            application:req.params.id,title,Type,Status,review
        });

        app.Status=Status;

        const adMin=await Admin.find({Admin_id:app.Admin_id});
        if(!adMin){
            res.status(400).send({error: "No admin for the applicaion"})
        }
        adMin.pending=adMin.pending<1?adMin.pending:adMin.pending-1;
        const updateApp=await Application.findByIdAndUpdate(req.params.id, {$set:app},{new:true});
        const updateAdmin=await Admin.findByIdAndUpdate(adMin._id, {$set:adMin},{new:true});
        
        let newProcessedApp=await processedApp.save();
        // console.log(newProcessedApp);

        res.send(newProcessedApp);

        
        
    }
    catch(err){
        console.log(err);
        res.status(400).send({error: "Bad request!"})
    }
})




module.exports=router