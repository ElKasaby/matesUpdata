const { Router } = require("express");
const express = require("express")
const router = require('express-promise-router')();
const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const multerConfig = require('../../multer')



const fileController = require('../controllers/file');

router.route('/:teamId/allFile')
  .get(passportJWT,fileController.allFile);

router.route('/:teamId/upload')
  .post(passportJWT,multerConfig,fileController.upload);

router.route('/:fileId/deleteFile')
  .delete(passportJWT,fileController.deleteFile);

module.exports = router