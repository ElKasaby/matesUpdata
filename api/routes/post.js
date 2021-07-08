const { Router } = require("express");
const express = require("express")
const router = require('express-promise-router')();
const mongoose = require('mongoose')
const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });


const postController = require('../controllers/post');

router.route('/:teamId/allPosts')
  .get(passportJWT,postController.allPosts );

router.route('/:teamId/addPost')
  .post(passportJWT,postController.addPost);

router.route('/:postId/editPost')
  .put(passportJWT,postController.editPost);

router.route('/:postId/deletePost')
  .delete(passportJWT,postController.deletePost);

router.route('/:postId/allReply')
  .get(passportJWT,postController.allReply);

router.route('/:postId/addReply')
  .post(passportJWT,postController.addReply);

router.route('/:postId/:replyId/editReply')
  .put(passportJWT,postController.editReply);

router.route('/:postId/:replyId/deleteReply')
  .delete(passportJWT,postController.deleteReply);


  
module.exports = router