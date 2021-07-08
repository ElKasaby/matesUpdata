const express = require("express");
const router = express.Router();

const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });

// private end points

router.get(
  "/notifications",
  passportJWT,
  require("../controllers/NotificationCtrl/fetchAll")
);
router.post(
  "/notifications/subscribe",
  passportJWT,
  require("../controllers/NotificationCtrl/subscribe")
);
router.post(
  "/notifications/unsubscribe",
  passportJWT,
  require("../controllers/NotificationCtrl/unsubscribe")
);
router.get(
  "/notifications/count",
  passportJWT,
  require("../controllers/NotificationCtrl/numberOfUnseen")
);

module.exports = router;
