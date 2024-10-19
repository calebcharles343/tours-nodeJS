const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

//////////////////////////////////////////
// ASYNC AWAIT TRY CATCH BLOCK ALTERNATIVE
//////////////////////////////////////////
const catchAsync = require('../utils/catchAsync');

////////////////////////////////////////////////
// CUSTOM ERROR CLASS FOR GLOBAL ERROR HANDLING
///////////////////////////////////////////////
const AppError = require('../utils/appError');

////////////////////////////////////////////////
//MIDDLEWARE ALIAS TO PREFILL VALUES FOR
//'/top-5-cheap' ROUTE
////////////////////////////////////////////////
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query) //qerry = Tour.find() and querryString = req.query
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Tour.findOne({ _id: req.params.id })
  const tour = await Tour.findById(req.params.id); // we need result of tour for if statement

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // jump striaght to error middleware if tour = null
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // jump striaght to error middleware if tour = null
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // jump striaght to error middleware if tour = null
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/*
queries are focused on fetching and filtering data, while aggregations involve 
transforming and summarizing data done in stages, usually through grouping and performing 
calculations.

STAGES:-
1, $match: filter
2, $group: group documents together using accumulators e.g.
*/
exports.getTourStats = catchAsync(async (req, res, next) => {
  //   const stats = await Tour.aggregate([stages])
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // _id dictates this grounping
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 } // asc = 1 and desc = -1
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } } // we can repeat stages
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' // to have 1 tour for each date
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0 // 1 : to show id and 0: hide id
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
