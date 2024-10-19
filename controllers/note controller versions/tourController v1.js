const fs = require('fs');
const Tour = require('../models/tourModel');

///////////////////////////////////
//DATA : Move to tourController.js
////////////////////////////////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

///////////////////////////////////////
//MIDDLEWARE: only applies to tourRoute
///////////////////////////////////////

//Param midware func: called if an 'id' is present in request
exports.checkId = (req, res, next, val) => {
  console.log(val);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'name or price not found'
    });
  }

  next();
};

/////////////////////////////////////////////
//ROUTE HANDELERS : Move to tourController.js
/////////////////////////////////////////////

exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1; // To create new Id for every tour added
  const newTour = Object.assign({ id: newId }, req.body); // To marge two objects together
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.getAllTours = (req, res) => {
  console.log(req.requestime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestime,
    result: tours.length,
    data: { tours }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //covert params to number

  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
