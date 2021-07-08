const { json } = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const Post = require('../models/post')
const imageModel = require('../models/file')
const multerConfig = require('../../multer')
const cloud = require('../../cloudinary')
const { replaceOne } = require('../models/user')
const fs = require('fs')




module.exports ={
    allFile: async(req, res, next)=>{
        // const upload = await FileUpload.find()
        // res.json(upload)
        const teamId = req.params.teamId
        const FileUpload = await imageModel.find({"team":teamId})

        if(FileUpload){
            return res.status(200).json({
                massage: "All file",
                FileUpload
            })
        }
        res.status(401).json({
            massage: "No FileUpload yet",
        })
    },
    upload: async(req, res, next)=>{
        const result = await cloud.uploads(req.files[0].path||req.files[0])
        const ownerName = req.user.name
        const theSize = req.files[0].size
        const fixedSize=(theSize/1000)/1000
        const size = fixedSize.toFixed(1);
       
        const imageDetails = {
            team : req.params.teamId,
            imageName : req.files[0].originalname ,
            uploadOwner: req.user.id, /// new added important 
            url : result.url,
            ownerName,
            size
        }
        const image = new imageModel(imageDetails)
        image.save()

        // delete image local
        fs.unlinkSync(req.files[0].path)

        res.json({
            msg : "DONE",
            image: image
        })
    },
    deleteFile: async(req, res, next)=>{
        const fileId = req.params.fileId
        const file = await imageModel.findById(fileId)
        if(file){
            await imageModel.deleteOne({"_id": fileId})
            return res.status(200).json({
                massage: "file Deleted",
            }) 
        }
        res.status(401).json({
            massage: "Error this file does not exist",
        })
    }
}