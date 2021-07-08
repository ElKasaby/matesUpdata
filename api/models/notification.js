const mongoose = require("mongoose");
const pagination = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:'User',
    },
    targetUsers: [
      {
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User',
      },
    ],
    subjectType: {
      type: String,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "subjectType",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default:
        "https://res.cloudinary.com/derossy-backup/image/upload/v1555206853/deross-samples/notifications/bell.png",
    },
  },
  { timestamps: true }
);

notificationSchema.methods.toFirebaseNotification = function () {
  return {
    notification: {
      title: this.title,
      body: this.body,
    },
  };
};

notificationSchema.plugin(pagination);

notificationSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc) {
    return {
      title: doc.title,
      body: doc.body,
      user: doc.user,
      icon: doc.icon,
      seen: doc.seen,
    };
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports.Notification = Notification;
