const mongoose = require("mongoose");
const pagination = require("mongoose-paginate-v2");


const schema = new mongoose.Schema({
  content: {
    type: String,
  },
  attachment: {
    type: String,
  },
  user:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  }
},{ timestamps: true }
);

schema.set("toJSON", {
  virtuals: true,
  transform: function (doc) {
    return {
      id: doc.id,
      content: doc.content,
      attachment: doc.attachment,
      user: doc.user,
      conversation: doc.conversation,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  },
});

schema.plugin(pagination);


const Message = mongoose.model("Message", schema);
module.exports.Message = Message;
