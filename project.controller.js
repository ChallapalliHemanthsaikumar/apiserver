const db = require("../models");
const ObjectId = require('mongodb').ObjectId;
const { project: Project} = db;

exports.createProject = (req,res) =>{
   
    const { Title,Status,Name,Assigned,Priority,Date,Description} = req.body;

    const user = new Project({
        Title:Title,
        Priority:Priority,
        Status:Status,
        Name:Name,
        Assigned:Assigned,
        Date:Date,
        Description:Description
        
    });

    user.save((err,project)=>{
        if(err){
            console.log(err)
        }
        
    })


    res.status(200)
    res.send("successfully registered")
}
exports.get = (req,res) =>{
    const { id} = req.body;
    Project.find({
        "_id":id
    },(err,data)=>{
        
        if(err){
            res.status(500).send("error")
        }
        res.status(200).send(data);
    })
}

exports.getlist = (req,res) =>{
   
    Project.find({
        
    },(err,data)=>{
        
        if(err){
            res.status(500).send("error")
        }
        res.status(200).send(data);
    })
}
exports.Deleteitem = (req,res) =>{
    const { id} = req.body;
   console.log(req.body)
    Project.findOneAndDelete({
        "_id":id
    },(err,data)=>{
        
        if(err){
            res.status(500).send("error")
        }
        res.status(200).send(data);
    })
}


exports.Edititem = (req,res) =>{
    const { Title,Status,Name,Assigned,Priority,id,Description} = req.body;
   console.log(req.body)
    Project.findOneAndUpdate({
        "_id":id
        
    },{
        Title:Title,
        Status:Status,
        Name:Name,
        Assigned:Assigned,
        Priority:Priority,
        Description:Description
    },(err,data)=>{
        console.log(data)
        if(err){
            res.status(500).send("error")
        }
        res.status(200).send(data);
    })
}


