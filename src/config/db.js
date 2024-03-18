const mongoose = require("mongoose");

const uri = process.env.urimongodb
async function connectDB() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected!");
}


module.exports = {connectDB};





