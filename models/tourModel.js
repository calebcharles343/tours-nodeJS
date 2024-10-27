const mongoose = require("mongoose");
const slugify = require("slugify");
const { isAlpha } = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"],
      minlength: [10, "A tour name must have more or equal than 10 characters"],
      validate: {
        // Fix by charles
        validator: function (val) {
          // console.log(isAlpha(val, ['en-US'], { ignore: ' ' }));
          return isAlpha(val, ["en-US"], { ignore: " " });
        },
        message: "A tour must only contain characters",
      },
    },
    slug: String,
    duration: { type: Number, required: [true, "A tour must have a duration"] },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size "],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty "],
      enum: {
        //this is only for strings
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be equal or above 1.0"],
      max: [5, "Rating must be equal or above 5.0"],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "A tour must have a price"] },
    priceDiscount: {
      type: Number,

      validate: {
        //Custom validator
        validator: function (val) {
          // validator only active at doc creation because of 'this'
          return val < this.price; // e.g 100 < 200
        },
        message: "Discount price ({VALUE}) should be less than regular price", //({VALUE}) is a mongoose syntax, like `${}` in js
      },
    },
    summary: {
      type: String,
      trim: true, // Remove white spaces at start and end of a string
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },

    images: [String],

    createdAT: {
      type: Date,
      default: Date.now(),
      select: false, // to hide field from users
    },

    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    //Virtual properties config
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual properties cannot use in a query : to keep the fat model, thin controllers logic
//created every database request
tourSchema.virtual("durationWeeks").get(function () {
  //always use func declaration here to access 'this' keyword
  //durationWeeks not technically part of the database
  return this.duration / 7;
});

tourSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

/* ################################# */
/* TYPES OF MIDDLEWARE IN MONGOOSE */
/* ################################# */
// 1. document
// 2. query
// 3. aggregate
// 4. model
/* ################################# */

///////////////////////////////////////////////////////////////
// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
///////////////////////////////////////////////////////////////

//PRE SAVE MIDDLEWARE : 'this' points to cuurent document
tourSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

////////////////////////////////////////////////////////////

//QUERY MIDDLEWARE:    //'this' points to current query
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  // any middleware that starts with `/^find/'
  this.find({ secretTour: { $ne: true } }); // true = hide and false = show

  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

////////////////////////////////////////////////////////

//AGGREGATION MIDDLEWARE :  //'this' points to current aggregation object
tourSchema.pre("aggregate", function (next) {
  // console.log(this.pipeline()); to view all stages
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
