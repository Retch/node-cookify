const { MongoClient } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;

const uri = "mongodb+srv://" + user +  ":" + password + "@" + host;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const hauptspeise = client.db("Rezepte").collection("Hauptspeise");


router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the API'
  });
});

router.get('/hauptspeise/random/:amount', (req, res) => {
  const amount = parseInt(req.params.amount);
  hauptspeise.aggregate([{ $sample: { size: amount } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get('/hauptspeise/random', (req, res) => {
  hauptspeise.aggregate([{ $sample: { size: 1 } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get('/rezept/id/:recipeid', (req, res) => {
  const id = parseInt(req.params.recipeid);
  hauptspeise.find({"_id": id}).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
