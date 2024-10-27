const mongoose = require('mongoose');
const dotenv = require('dotenv'); // for 'config.env' file

//////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL UNCAUGHT EXCEPTION ERROR HANDLER as (Last Safety Net) i.e. SYNCHRONOUSE CODE
/////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! ❌ Shutting down...');
  console.log(err.name, err.message);
  // console.log(err.name, err.message, err.stack);
  process.exit(1); //graceful shutdown
});

/////////////////////////////////////////////////////////

dotenv.config({ path: './config.env' }); // use for 'config.eng' file $ Its available everywhere
// console.log(app.get('env')); //to get working environment
// console.log(process.env); //to get working environment

const app = require('./app'); //Import express

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

////////////////////
//START SERVER
//////////////////
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

////////////////////////////////////////////////////////////////////////////////////
//GLOBAL UNHANDLED REJECTION ERROR HANDLER as (Last Safety Net)
//for rejected promises not handled i.e. ASYNCHRONOUSE CODE
/////////////////////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! ❌ Shutting down...');
  console.log(err.errmsg, err.codeName);

  server.close(() => process.exit(1));
});
