const { MongoClient } = require('mongodb');
const express = require('express');
const { json } = require('express');
const app = express();

const uri = "mongodb+srv://netlify:W8pWilx29fqTrSQt@cluster0.q42oh.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const hauptspeise = client.db("Rezepte").collection("Hauptspeise");




app.get('/api', (req, res) => {
  res.send({
    message: 'Welcome to the API'
  });
});

app.get('/api/hauptspeise/random/:amount', (req, res) => {
  const amount = parseInt(req.params.amount);
  hauptspeise.aggregate([{ $sample: { size: amount } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/hauptspeise/random', (req, res) => {
  hauptspeise.aggregate([{ $sample: { size: 1 } }]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/rezept/id/:recipeid', (req, res) => {
  const id = parseInt(req.params.recipeid);
  hauptspeise.find({"_id": id}).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});



app.listen(8080);