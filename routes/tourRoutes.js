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
// router.param('id', tourController.checkId);

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

//Aliasing : to pre fill query
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
/////////////////////////////////////////////

//Stats
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

/////////////////////////////////////////////

router
  .route('/')
  .post(tourController.createTour)
  .get(tourController.getAllTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
