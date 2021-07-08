const mongoose = require("mongoose");
const pagination = require("mongoose-paginate-v2");


const schema = new mongoose.Schema(
  {
    users: [
      {
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
    ],
    meta: [metaSchema()],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

schema.set("toJSON", {
  virtuals: true,
  transform: function (doc) {
    return {
      id: doc.id,
      users: doc.users,
      meta: doc.meta,
      lastMessage: doc.lastMessage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  },
});

function metaSchema() {
  const schema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
      countOfUnseenMessages: {
        type: Number,
        default: 0,
      },
    },
    { _id: false }
  );

  schema.set("toJSON", {
    transform: function (doc) {
      return {
        user: doc.user,
        countOfUnseenMessages: doc.countOfUnseenMessages,
      };
    },
  });

  return schema;
}

schema.plugin(pagination);


const Conversation = mongoose.model("Conversation", schema);
module.exports.Conversation = Conversation;
