const express = require('express');

///////////////////////////////////////////////////
//ROUTE HANDELERS : Move to'tourController.js' file
///////////////////////////////////////////////////

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is note yet defined'
  });
};
const getAllUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is note yet defined'
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is note yet defined'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is note yet defined'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is note yet defined'
  });
};

//////////////////////
//ROUTER
//////////////////////
const router = express.Router();

router
  .route('/')
  .post(createUser)
  .get(getAllUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
