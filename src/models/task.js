const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs")
const taskSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  secureUrl: {
    type: String,
    required: true,
    minlength: 12,
    validate(value) {
      if (value.includes("http://")) {
        throw new Error("url should be https!");
      }
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
});

taskSchema.pre('save', async function (next) {
  console.log("middleware of task!");
  next()
})

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
