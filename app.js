const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const morgan = require('morgan');
var MongoClient = require("mongodb").MongoClient;

const app = express();
//app.use(morgan('combined'));
// app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); //Parse application/xxx-www-url form encoded
app.use(bodyParser.json()); //parse application/json

app.get("/posts", (req, res) => {
  console.log(res.body);
  res.send([
    {
      title: "Hello World!",
      description: "Hi there! How are you?"
    }
  ]);
});
var url = 'mongodb://ktrajasekar:FeedBack!123@ds161724.mlab.com:61724/feedbackform';
app.post("/form", (req, res) => {
  const item = req.body;
  console.log(item);
  MongoClient.connect(url,
    function(err, db) {
      db.collection("feedbackdata", function(err, collection) {
        if (err) throw err;
        collection.insert(item);
        db.collection("feedbackdata").count(function(err, count) {
          if (err) throw err;
          console.log("Total Rows: " + count);
        });
      });
    }
  );
  res.send("Success");
});

app.get("/getdata", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    db.collection("feedbackdata").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
});

app.listen(process.env.PORT || 8081);
