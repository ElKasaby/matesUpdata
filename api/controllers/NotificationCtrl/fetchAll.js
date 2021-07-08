const { Notification } = require("../../models/notification");
const _ = require("lodash");

module.exports = async (req, res) => {
  const user = req.user;
  
  let notifications = await Notification.find({
    targetUsers: { $in: [user.id] },
  })
    .sort("-createdAt")
    .populate("subject");

  for (let i = 0; i < notifications.length; i++) {
    let notification = _.cloneDeep(notifications[i]); // here copy values not reference
    // let notification = collection[i] // copy reference
    if (notification.seen) continue;
    notification.seen = true;
    await notification.save();
  }

  return res.status(200).json(notifications);
};
