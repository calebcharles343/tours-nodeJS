const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

///////////////////////////////
//CONNECTING TO DATABASE
///////////////////////////////

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(con => {
  // console.log(con.connections);
  console.log('DATABASE CONNECTION SUCCESSFUL');
}); // connect to mongoDB server

//////////////////
// READ JSON FILE
//////////////////

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

///////////////////////
// IMPORT DATA INTO DB
///////////////////////

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //Aggressively end app process
};

///////////////////////////
// DELETE ALL DATA FROM DB
///////////////////////////
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //Aggressively end app process
};

////////////////////////////
// Initialization
// node dev-data/data/import-dev-data.js --import: to load data
// node dev-data/data/import-dev-data.js --delete: to delete data
/////////////////////////////
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv); // To view all processes in an [array]
