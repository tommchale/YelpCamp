// want seed files to be self contained
if (process.env.NODE !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const cities = require("./cities");
const {
  places,
  descriptors
} = require("./seedHelpers");
// . means back out one
const Campground = require("../models/campground");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// function to return random element of that array

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // clear the database
  await Campground.deleteMany({});
  for (let i = 0; i < 150; i++) {
    const randomNum = Math.floor(Math.random() * 443);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "5fd1e2ab1cbcd189410ecfb8",
      location: `${cities[randomNum].city}, ${cities[randomNum].country}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomNum].lng, cities[randomNum].lat],
      },
      images: [{
          url: "https://res.cloudinary.com/db2zsdvyh/image/upload/v1607605801/YelpCamp/dkmzcwgbwukurqeo52ph.jpg",
          filename: "YelpCamp/dkmzcwgbwukurqeo52ph",
        },
        {
          url: "https://res.cloudinary.com/db2zsdvyh/image/upload/v1607635130/YelpCamp/mg7p1zxumyqtee0pjvm8.jpg",
          filename: "YelpCamp/mg7p1zxumyqtee0pjvm8",
        },
      ],
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga ratione nostrum voluptas minus corporis ad atque itaque ex reiciendis recusandae a sint blanditiis, accusantium voluptatem distinctio omnis delectus. Culpa, similique?",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  // when your done should close the database
  mongoose.connection.close();
});