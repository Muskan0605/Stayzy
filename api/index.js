const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// This jwt code sets up an Express.js server with CORS support, connects to a MongoDB database using Mongoose, and provides routes for user registration and login.
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fhdbjsabfijkfjk";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "https://stayzy-dk96awpiw-muskan-srivastavas-projects-fc207468.vercel.app/",
  })
);
// console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req){
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    resolve(userData);
  });
  });
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/_upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName, // ✅ Corrected path
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext; // eg: uploads/1234567890.jpg
    fs.renameSync(path, newPath);
    // uploadedFiles.push(newPath.replace('uploads/', ''));
    uploadedFiles.push(
      newPath.replace(/^uploads[\\/]/, "").replace(/\\/g, "/")
    );
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "JWT token missing. Please log in." });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Invalid token. Please log in again." });
    }

    const {
      title,
      address,
      addedPhotos,
      description,
      extraInfo,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos:addedPhotos,
        description,
        extraInfo,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    } catch (e) {
      res
        .status(500)
        .json({ error: "Could not save place data.", details: e.message });
    }
  });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({owner:id}));
      });
});

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id,
      title,
      address,
      addedPhotos,
      description,
      extraInfo,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
            const placeDoc = await Place.findById(id);           
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
        title,
        address,
        photos:addedPhotos,
        description,
        extraInfo,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        price,
      })
    await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.post('/booking', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {place, checkIn, checkOut, numberOfGuests, name, phone, price} = req.body;
  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price, user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
})


app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user:userData.id }).populate('place'));  
})

app.listen(4000);

//muskangkp03
//ePPwt8SDtXa8Et3G
