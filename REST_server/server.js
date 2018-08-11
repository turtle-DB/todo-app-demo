// Library Imports
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

// Local Imports
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');

var app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

// ------> TODO ROUTES

// POST One Todo
app.post('/todos', (req, res) => {
  var todo = new Todo(req.body);

  todo.save().then(
    (doc) => {
      res.send({ todo: doc });
    },
    (error) => {
      res.status(400).send(error);
    }
  );
});

// GET All Todos
app.get('/todos', (req, res) => {
  Todo.find({}).then(
    (allDocs) => { res.send({ todos: allDocs }) },
    (err) => { res.status(400).send(err) }
  );
});

// GET One Todo
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  Todo.findOne({
    _id: id,
  })
    .then(doc => {
      if (!doc) { res.status(404).send(); }
      res.send({ todo: doc });
    })
    .catch(err => res.status(400).send());
});

// DELETE One Todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  Todo.findOneAndRemove({
    _id: id,
  })
    .then(doc => {
      if (!doc) { res.status(404).send(); }
      res.send({ todo: doc });
    })
    .catch(err => res.status(400).send());
});

// PUT One Todo
app.put('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name', 'isCompleted']);

  Todo.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
    .then(doc => {
      if (!doc) { res.status(404).send(); }
      res.send({ todo: doc });
    })
    .catch(err => res.status(400).send());
});

app.listen(port);
console.log(`Running on port ${port}...`);

module.exports = { app };