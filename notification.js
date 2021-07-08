const admin = require("firebase-admin");

const serviceAccount = require("./mates-ea783-firebase-adminsdk-fjrpr-9b46262b41.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  async sendNotification(token, message) {
    message.token = token;
    return await admin.messaging().send(message);
  },
};
