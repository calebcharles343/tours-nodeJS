const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

/*//////////////////////*/
/*AUTHENTICATION ROUTE*/
/*//////////////////////*/
//These are special end points that do not 100% fit the rest philosophy

/*//////////////////////*/
router.post('/signup', authController.signup);

/*//////////////////////*/
/*BASIC CRUD ROUTE*/
/*//////////////////////*/
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
