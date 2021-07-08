const { Router } = require("express");
const express = require("express")
const router = require('express-promise-router')();
const mongoose = require('mongoose')
const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const multerConfig = require('../../multer')



const TeamController = require('../controllers/team');


// Out team
router.route('/')
  .get(passportJWT, TeamController.getAllTeam);

router.route('/addteam')
  .post(passportJWT,multerConfig, TeamController.addTeam);

router.route('/:id/viewMember')
  .get(passportJWT, TeamController.viewMember);

router.route('/:id/invite')
  .post(passportJWT, TeamController.invite);

router.route('/:id/leave')
  .post(passportJWT, TeamController.leave);

router.route('/:id/editTeam')
  .put(passportJWT, TeamController.editTeam);

router.route('/:id/deleteTeam')
  .delete(passportJWT, TeamController.deleteTeam);



module.exports = router