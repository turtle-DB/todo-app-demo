var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 60
  }
});

module.exports = { Todo: Todo };
// Or with ES6: module.exports = {Todo};