const express = require("express");
const conversationCntrl = require("../controllers/Conversation");
const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.get("/conversations", passportJWT, conversationCntrl.fetchAll);
router.get(
  "/conversations/:id/messages",
  passportJWT,
  conversationCntrl.fetchMessagesForCoversation
);
router.get(
  "/check-conversations/:userId",
  passportJWT,
  conversationCntrl.check
);

module.exports = router;
