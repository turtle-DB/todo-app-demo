var mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI);

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose: mongoose };
// Or with ES6: module.exports = {mongoose};