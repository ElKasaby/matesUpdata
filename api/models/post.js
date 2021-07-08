const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  team:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:'team'
  },
  body:{
    type: String,
    required: true
  },
  comments: [{
    commentBody: {
      type: String,
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type:  mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    ownerName:{
      type: String
    },
    ownerImage:{
      type: String
    }
  }],
  postOwner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  date:{
    type: Date,
    default: Date.now
  },
  ownerName:{
    type: String
  },
  ownerImage:{
    type: String
  }

})
 
 


module.exports = mongoose.model('post',postSchema) 