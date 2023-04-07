var express = require('express');
var router = express.Router();

const upload = require("./multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");

let LOCAL_DB = [
  {
    id: 'e23423-324-2342',
    title: 'Naruto',
    author: 'abhay',
    image: 'gallery_img_1.jpg',
  }
];

router.get('/', function (req, res, next) {
  res.render('show', { cards: LOCAL_DB, });
});

router.get('/add', function (req, res, next) {
  res.render('add');
});


router.post('/add', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) return res.send(err);
    const { title, author } = req.body;
    const newImage = {
      id: uuid(),
      title,
      author,
      image: req.file.filename,
    };

    LOCAL_DB.push(newImage);
    res.redirect('/');
  });

  // res.render('add');

});


router.get('/update/:id', function (req, res, next) {
  const id = req.params.id;
  // const {title,author} = req.body;

  const data = LOCAL_DB.filter(function (d) {
    return d.id === id;
  });

  res.render('update', { card: data[0] });
});


router.get('/delete/:id', function (req, res, next) {
  const id = req.params.id;

  const cardIndex = LOCAL_DB.findIndex((d) => d.id === id);

  fs.unlinkSync(
    path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      LOCAL_DB[cardIndex].image
    )
  );

  LOCAL_DB.splice(cardIndex, 1);

  res.redirect("/");

});

router.post('/update/:id', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) return res.send(err);
    const id = req.params.id;
    const cardIndex = LOCAL_DB.findIndex((d) => d.id === id);
    const updatedData = {
      title: req.body.title,
      author: req.body.author,
    };
    if (req.file) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          req.body.oldgallery,
        )
      );
      updatedData.image = req.file.filename;
    };

    LOCAL_DB[cardIndex] = {...LOCAL_DB[cardIndex], ...updatedData};

    res.redirect('/');

  });




});










module.exports = router;
