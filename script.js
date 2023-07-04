const express = require("express");
const multer = require("multer");
const database = require("./database/database");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "Images")));
app.set("views engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./Images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}.${file.originalname.split(".")[1]}`);
  },
});

const upload = multer({
  storage,
}).single("image");

app.get("/", (req, res) => {
  res.json({
    message: "Welcome",
  });
});

app.get("/upload", (req, res) => {
  res.render(__dirname + "/index.ejs");
});

app.get("/image", async (req, res) => {
  let imageLinks = await database.find({});
  if (imageLinks.length != 0) {
    imageLinks = imageLinks[0].links;
    res.render(__dirname + "/display.ejs", { images: imageLinks });
  } else {
    res.json({
      message: "No Images Found, Upload Some Images",
    });
  }
});

app.post("/upload", upload, async (req, res) => {
  let fileName = req.file.filename;
  let prevData = await database.find({});
  if (prevData.length == 0) {
    let names = [];
    names.push(fileName);
    await database({
      links: names,
    }).save();
    res.redirect("/image");
  } else if (prevData.length != 0) {
    await database.updateOne({ $push: { links: fileName } });
    res.redirect("/image");
  }
});

app.listen(500);
