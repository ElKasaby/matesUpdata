const express = require("express")
// const router = express.Router()
const router = require('express-promise-router')();
const mongoose = require('mongoose')
const passport = require('passport');
const passportConf = require('../../passport');
const multerConfig = require('../../multer')


const { validateBody, schemas } = require('../helpers/router-helpers');
const UsersController = require('../controllers/user');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false })

router.route('/signup')
  .post(multerConfig, UsersController.signup);//validateBody(schemas.authSchema), 

router.route('/signin')
  .post(passportSignIn, UsersController.signin); 

// router.route('/oauth/google')
//   .post(passportGoogle, UsersController.googleOAuth);

// router.route('/oauth/facebook')
//   .post(passportFacebook, UsersController.facebookOAuth);

router.route('/verifyCode')
  .post(UsersController.verifyCode)


router.route('/editProfile')
  .put(passportJWT, multerConfig, UsersController.editProfile);

router.route('/:id/profile')
  .get(passportJWT, UsersController.profile);

module.exports = router