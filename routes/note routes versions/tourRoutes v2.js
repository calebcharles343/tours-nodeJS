const express = require('express');
const tourController = require('../controllers/tourController');

// const tourController = require('../Controllers/tourController'); //Destructure style

//////////////////////
//ROUTES
//////////////////////
const router = express.Router();

///////////////////////////////////////
//USE EXCLUSIVE TOUR MIDDLEWARE
///////////////////////////////////////
router.param('id', tourController.checkId);

///////////////////////
//HANDLER METHODS
///////////////////////

//Destructure style
// const {
//   createTour,
//   getAllTours,
//   getTour,
//   updateTour,
//   deleteTour
// } = tourController;

//////////////////////
//ROUTES
//////////////////////

router
  .route('/')
  .post(tourController.checkBody, tourController.createTour)
  .get(tourController.getAllTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
