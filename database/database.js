const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.udfwpx5.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "binayak" }
  )
  .then(() => {
    console.log("Database Connected Successfully");
  });

let schema = mongoose.Schema({
  links: Array,
});

let model = mongoose.model("model", schema, "images");

module.exports = model;
