const { MongoClient } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

const uri = "mongodb+srv://netlify:W8pWilx29fqTrSQt@cluster0.q42oh.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const hauptspeise = client.db("Rezepte").collection("Hauptspeise");


app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the API'
  });
});

app.get('/hauptspeise/random/:amount', (req, res) => {
  const amount = parseInt(req.params.amount);
  hauptspeise.aggregate([{ $sample: { size: amount } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/hauptspeise/random', (req, res) => {
  hauptspeise.aggregate([{ $sample: { size: 1 } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/rezept/id/:recipeid', (req, res) => {
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
