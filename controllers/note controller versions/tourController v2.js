const { query } = require('express');
const fs = require('fs');
const Tour = require('../models/tourModel');

/////////////////////////////////////////////
//ROUTE HANDELERS : Move to tourController.js
/////////////////////////////////////////////

//aliasing : to prefill getAllTours query
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    ///////////////////////
    // BUILD QUERY
    ///////////////////////
    // 1A) BASIC FILTERING
    const queryObj = { ...req.query }; // hard copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(req.query, queryObj);
    // const tours = await Tour.find(queryObj);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b{gte|gt|lte|lt}\b/g, match => `$${match}`); Jonas replace method had problems
    const regex = /\b(gte|gt|lte|lt)\b/g;
    queryStr = queryStr.replace(regex, '$$$1');
    console.log(JSON.parse(queryStr));

    // const query = Tour.find(queryObj);  // BASIC FILTERING
    // const query = Tour.find(JSON.parse(queryStr)); // ADVANCED FILTERING
    let query = Tour.find(JSON.parse(queryStr)); // ADVANCED FILTERING

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort{'price ratingAverage'}
    } else {
      query = query.sort('-createdAt');
    }

    // 3) FIELD LIMITING (Incase of heavy datasets to reduce bandwidth consumption)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields); // this is called projecting
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit; // skip on page 1 will always be zero

    //page=2&limit=10: page 1 = 1-10 (results), page 2 = 11-20 (results),etc.
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    /////////////////
    // EXECUTE QUERY
    /////////////////
    const tours = await query;
    //query.sort().select().skip().limit()
    ///////////////////
    //Mongoose query methods
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    ///////////////////////////

    /////////////////
    // SEND RESPONSE
    /////////////////
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // OR Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }); // { new: true}: to return updated tour

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
