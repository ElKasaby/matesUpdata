const JWT = require('jsonwebtoken')
const { json } = require('body-parser')
// const mongose = require('mongoose')
const User = require('../models/user')
const cloud = require('../../cloudinary')
const fs = require('fs')
const nodemailer = require("nodemailer");
const CodeGenerator = require("node-code-generator");


signToken = user => {
    return JWT.sign({
        iss: 'Elkasaby',
        sub:user.id,
        _id:user.id,
        jat: new Date().getTime(),// current time
        exp: new Date().setDate(new Date().getDate()+1)// current time + 1 day ahead 
    },process.env.JWT_KEY)
}

module.exports = {
    signup: async (req, res, next)=>{
        const result = await cloud.uploads(req.files[0].path||req.files[0])
        const { name, email, password, confirmPassword, bio, phone, address, track, mySkills, deviceType, deviceToken } = req.body

        // //check if there is a user with the same name
        // const foundname = await User.findOne({"name": name})
        // if(foundname){
        //    return res.status(403).json({
        //         error : 'name is already exist'
        //     })
        // }

        //check if there is a user with the same email
        const foundemail = await User.findOne({"email": email})
        if(foundemail){
           return res.status(403).json({
                error : 'Email is already exist'
            })
        }

        // check if password is match
        if(password != confirmPassword){
            return res.status(409).json({
                message: 'Password do not match'
            })
        }

        // check length of password
        if(req.body.password.length < 7){
            return res.status(409).json({
                message: 'Password must be at least 8 characters'
            })
        }

        ///verification Email
        var generator = new CodeGenerator();
        const code = generator.generateCodes("#+#+#+", 100)[0];

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "mohamed1alasby@gmail.com",
                pass: process.env.pass,
            },
        });

        var mailOptions = {
            from: "mohamed1alasby@gmail.com",
            to: req.body.email,
            subject: "Verfication Code",
            text: `your verfication code ${code}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
        // console.log(result.url);
        // console.log(req.files[0].originalname);
        //create a new user
        const pushTokens = [{
            deviceType,
            deviceToken
        }]
        const newUser = new User({
            // methods: 'local',
            // local: {
            name: name,
            email: email,
            password: password,
            emailVerifingCode: code,
            bio: bio,
            phone: phone,
            address: address,
            track : track,
            mySkills: mySkills,
            // },
            image: req.files[0].originalname,
            url: result.url,
            pushTokens: pushTokens
        })  
        await newUser.save()
        fs.unlinkSync(req.files[0].path)
        res.status(200).json({
            msg: "done sign up",
            newUser
        })

        // Generate the token 
        // const token = signToken(newUser)

        // res.status(200).json({
        //     token,
        //     id: newUser.id,
        //     name: req.body.name,
        //     email: req.body.email,
        //     newUser
        // })

        
    },
    verifyCode: async (req, res, next) => {
        let user = await User.findOne({ email: req.body.email });   
        if (!user) {
          return res.status(404).send("User with the given email not exits");
        }
        try {
          if (user.emailVerifingCode == req.body.code) {
            // user.enabled = true;
            // user.emailVerifingCode = "";

            await User.updateOne({ email: req.body.email },{ $set: {enabled: true , emailVerifingCode: ""}})
            const token = signToken(user)
            res.status(200).json({
                token,
                user
            })
          }else{
            await User.deleteOne({"_id": user.id})
            res.status(404).send("sorry code is not correct . plz, try sign up again")
          }
        } catch (error) {
          next(error);
        }
    },

    signin: async (req, res, next)=>{

        const user = await User.findOne({ "email": req.body.email })

        // Generate token
        const token = signToken(req.user)
        res.status(200).json({
            token,
            user
        })
    },

    // googleOAuth: async (req, res, next)=>{
    //     const token = signToken(req.user)
    //     res.status(200).json({
    //         token
    //     })
    // },

    // facebookOAuth: async (req, res, next)=>{
    //     const token = signToken(req.user)
    //     res.status(200).json({
    //         token,
    //         message:"connect with facebook"
    //     })
    // },
    editProfile: async (req, res, next)=>{
        // const profile = await User.findOne({"_id":req.user._id })
        const result = await cloud.uploads(req.files[0].path||req.files[0])
        req.body.image = req.files[0].originalname
        req.body.url = result.url
        
        await User.updateOne({ _id: req.user._id },{ $set: req.body})
        const profile = await User.findOne({"_id":req.user._id })
        // // new value
        // await profile.set(req.body).save()
        res.status(200).json({
            message: 'Edit Done',
            profile
        })

    },
    profile : async (req, res, next)=>{
        const profileId = req.params.id
        const profile = await User.findOne({"_id": profileId})
        console.log(profile);
        if(profile){
            return res.status(200).json({
                message: 'this is the profile',
                profile
            })
        }
        res.status(200).json({
            message: 'this profile is not found',
        })


    }
}