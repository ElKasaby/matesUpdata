const { json } = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const Post = require('../models/post')
const post = require('../models/post')
const { replaceOne } = require('../models/user')
const {Notification} = require('../models/notification')




module.exports ={
    allPosts: async(req, res, next)=>{
        const teamId = req.params.teamId
        const post = await Post.find({"team":teamId})
        
        
        if(post){
            return res.status(200).json({
                massage: "All posts",
                post
            })
        }
        res.status(401).json({
            massage: "No post yet",
        })
    },
    addPost: async(req, res, next)=>{
        const ownerName = req.user.name
        const ownerImage = req.user.url
        //create a new post
        const newPost = new Post({
            team: req.params.teamId,
            body: req.body.postBody,
            postOwner: req.user.id,
            ownerName: ownerName,
            ownerImage: ownerImage
        })
        await newPost.save()
        res.status(201).json(newPost)

        // Send Notification in-app
        const clients = await Team.find({_id: req.params.teamId}).populate("teamMember");
        const targetUsers = clients.map((user) => user.teamMember);
        const notification = await new Notification({
            title: "Add post",
            body: `${ownerName} add post in ${clients.teamName} `,
            user: req.user._id,
            targetUsers: targetUsers,
            subjectType: "post",
            subject: newPost.id ,
        }).save();
  
        // push notifications
        const receivers = targetUsers;
        for (let i = 0; i < receivers.length; i++) {
            await receivers[i].sendNotification(
            notification.toFirebaseNotification()
        );
        }

    },
    editPost: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findOne({"_id": postId})

        if(post.postOwner != req.user.id){
            return res.status(403).json({
                message: "you cannot access this"
            })
        }
        
        post.body = req.body.postBody
        await post.save()
        res.status(200).json({
            massage:'post updata done',
            post
        })
    },
    deletePost: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if(post){
            if(post.postOwner == req.user.id){
                await Post.deleteOne({"_id": postId})
                return res.status(200).json({
                    massage: "post Deleted",
                })
            }
            res.status(401).json({
                massage: "Error this is not your post",
            })
        }
        res.status(401).json({
            massage: "Error this post does not exist",
        })
        
    },
    allReply: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        const replys = post.comments
        if(post){
            return res.status(200).json({
                replys
            })
        }
        res.status(401).json({
            massage: "Error this post does not exist",
        })
    },
    addReply: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        const ownerName = req.user.name
        const ownerImage = req.user.url
        //create new comment
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id,
            ownerName: ownerName,
            ownerImage: ownerImage
        }

        post.comments.unshift(newComment)
        await post.save()
        res.status(201).json({
           massage  : 'Reply add sucsusfly',
           post
        })

        // Send Notification in-app
        const notification = await new Notification({
            title: "Add comment",
            body: `${req.user.name} comment in your post `,
            user: req.user._id,
            targetUsers: post.postOwner,
            subjectType: "post",
            subject: newComment.id,
        }).save();
  
        // push notifications
        await post.sendNotification(notification.toFirebaseNotification());
    },
    editReply: async(req, res, next)=>{
        const postId = req.params.postId
        const replyId = req.params.replyId
        const post = await Post.findById(postId)
        
        const comment =post.comments

        

        for(var i= 0; i <comment.length ; i++){
            if(comment[i].id == replyId){

                // if(comment[i].commentUser.id!== req.user){
                //     return res.status(403).json({
                //         message: "you cannot access this"
                //     })
                // }
                comment[i].commentBody = req.body.commentBody
                const com = comment[i]
                await post.save()
                return res.status(200).json({
                    massage: "Reply updated",
                    com
                })            
            }
        }
        res.status(401).json({
            massage: "Reply does not updated",
            comment
        })
    },
    
    deleteReply: async(req, res, next)=>{
        const postId = req.params.postId
        const replyId = req.params.replyId
        const post = await Post.findById(postId)
        
        const comment =post.comments
        

        for(var i= 0; i <comment.length ; i++){
            if(comment[i].id == replyId){
                comment.splice(i,1)  
                await post.save()
                return res.status(200).json({
                    massage: "Reply Deleted",
                    comment
                })            
            }
        }
        res.status(401).json({
            massage: "Reply does not exist",
            comment
        })
    },

}