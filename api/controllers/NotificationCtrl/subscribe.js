const _ = require("lodash");

module.exports = async (req, res) => {
  const user = req.user;

  const token = req.body.token;
  if (token) {
    const index = _.findKey(
      user.pushTokens,
      _.matchesProperty("deviceToken", token)
    );
    if (index === undefined) {
      user.pushTokens.push({
        deviceType: req.body.deviceType,
        deviceToken: token,
      });
    }
  }

  await user.save();
  return res.status(200).json(user);
};
