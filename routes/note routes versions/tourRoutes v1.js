const express = require('express');
const fs = require('fs');

///////////////////////////////////////////
//DATA : Move to 'tourController.js' file
///////////////////////////////////////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

////////////////////////////////////////////////////
//ROUTE HANDELERS : Move to 'tourController.js' file
/////////////////////////////////////////////////////

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1; // To create new Id for every tour added
  const newTour = Object.assign({ id: newId }, req.body); // To marge two objects together
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        console.log('Error writing to database');
      } else {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour
          }
        });
      }
    }
  );
};

const getAllTours = (req, res) => {
  console.log(req.requestime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestime,
    result: tours.length,
    data: { tours }
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //covert params to number

  const tour = tours.find(el => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>'
    }
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

//////////////////////
//ROUTER
//////////////////////
const router = express.Router();
router
  .route('/')
  .post(createTour)
  .get(getAllTours);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
