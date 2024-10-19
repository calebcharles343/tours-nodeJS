const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//////////////////////////
//Middleware
//////////////////////////
app.use(express.json()); // body-parcer
app.use(morgan('dev')); // request-parcer
////////////////////////////
//Custom-Middleware : applies to every request
////////////////////////////
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestime = new Date().toISOString();
  next();
});

/////////////////////////////////////////////
//DATA: Moved to routes/tourRoutes.js (needed)
/////////////////////////////////////////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//////////////////////////////////////
//ROUT HANDELERS : Moved to routes/tourRoutes.js or routes/userRoutes.js
//////////////////////////////////////

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

/////////////////////////

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

////////////////////////////
//ROUTES : Moved to routes/tourRoutes.js or routes/userRoutes.js
////////////////////////////

//Basic style
/*
app.post('/api/v1/tours', createTour);

app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTour);

app.patch('/api/v1/tours/:id', updateTour);

app.delete('/api/v1/tours/:id', deleteTour);
*/

//Chainin stye
app
  .route('/api/v1/tours')
  .post(createTour)
  .get(getAllTours);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/////////////////////////

app
  .route('/api/v1/users')
  .post(createUser)
  .get(getAllUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

////////////////
//START SERVER
////////////////
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
