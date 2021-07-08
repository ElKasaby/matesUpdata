const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");
const _ = require("lodash");
const {Notification} = require('../models/notification')

// const { find } = require("../models/user");

exports.fetchAll = async (req, res) => {
  console.log("new error");
  const conversations = await Conversation.find
    ({"users": req.user.id})
    .sort("-createdAt")
    .populate([{path: "users", select: "name url"}, "lastMessage"])
  
  res.status(200).send(conversations);
};

exports.fetchMessagesForCoversation = async (req, res) => {
  console.log("we are here 1");
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation)
    return res.status(404).send("No Conversation with that id");

  if (conversation.users.indexOf(req.user._id) === -1)
    return res.status(403).send("Dont allow to view these messages");

  let key = _.findKey(conversation.meta, { user: req.user._id });
  if (key !== undefined) {
    conversation.meta[key].countOfUnseenMessages = 0;
    await conversation.save();
  }
  //find().sort().populate()
  const messages = await Message.find
    ({"conversation": req.params.id})
    .sort("-createdAt")
    .populate([{path: "user", select: "name url"}])

  res.status(200).send(messages);
};

exports.check = async (req, res) => {
  let conversation = await Conversation.findOne({
    $or: [{ users: [req.user.id, req.params.userId] }, { users: [req.params.userId, req.user.id] }],
  }); 
    // if not 404 --- space if okay conut
  if(!conversation){
    return res.status(401).send("Error give me new conversation")
  }
  if (conversation.users.indexOf(req.user._id) === -1)
    return res.status(403).send("Dont allow to view these messages");

  let key = _.findKey(conversation.meta, { user: req.user._id });
  if (key !== undefined) {
    conversation.meta[key].countOfUnseenMessages = 0;
    await conversation.save();
  }

  const messages = await Message.find
    ({"conversation": conversation.id})
    .sort("-createdAt")
    .populate([{path: "user", select: "name url"}])
  res.status(200).send(messages);
};
