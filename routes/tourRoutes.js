const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

//////////////////////
//ROUTES
//////////////////////

//Aliasing : to pre fill query
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
/////////////////////////////////////////////

//Stats
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

/////////////////////////////////////////////

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect, // protect privide the user obj to restricTo()
    authController.restrictTo("lead-guide", "admin"),
    tourController.deleteTour
  );

module.exports = router;
