const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const notificationService = require("../../notification");


const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  emailVerifingCode:{
    type:String,
    require:true
  },
  image: {
    type:String
  },
  url: {
    type: String,
  },
  bio:{
    type: String,
  },
  phone:{
    type: String,
  },
  address:{
    type: String,
  },
  track:{
    type: String,
  },
  mySkills:{
    type: String,
  },
  pushTokens: [
    new mongoose.Schema(
      {
        deviceType: {
          type: String,
          enum: ["android", "ios", "web"],
          required: true,
        },
        deviceToken: {
          type: String,
          required: true,
        },
      },
      { _id: false }
    ),
  ],
})

userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc) {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      image: doc.image,
      url: doc.url,
      bio: doc.bio,
      address: doc.address,
      track: doc.track,
      mySkills: doc.mySkills
    };
  },
});

userSchema.pre('save', async function (next) {
    try {
      // if(this.methods !== 'local'){
      //   next()
      // }
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.password, salt);
      // Re-assign hashed version over original, plain text password
      this.password = passwordHash;
      next();
    } catch (error) {
      next(error);
    }
  });

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
}

userSchema.methods.sendNotification = async function (message) {
  let changed = false;
  let len = this.pushTokens.length;
  while (len--) {
    const deviceToken = this.pushTokens[len].deviceToken;
    try {
      console.log("1");
      await notificationService.sendNotification(deviceToken, message);
      console.log("2");
    } catch (error) {
      // console.log(error);
      this.pushTokens.splice(len, 1);
      changed = true;
    }
  }
  if (changed) await this.save();
};
 


module.exports = mongoose.model('User',userSchema) 