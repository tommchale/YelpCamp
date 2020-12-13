const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// defining a one to many relationship as there is the possiblility for a campground to have thousands of reviews
// https://res.cloudinary.com/db2zsdvyh/image/upload/w_300/v1607103615/YelpCamp/fkjcgycju9nvsio0jtjm.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload/w_450,h_300", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// to get information to show in map - need to create a virtual property in the schema, enable that schema to show through mongoose, then refer to it in the map

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0, 30)}...</p>`;
});

// findOneAndDelete is a query middleware called by the findByIdAndDelete mongo call
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // This is removing review from review db where id was in the campground reviews array
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
