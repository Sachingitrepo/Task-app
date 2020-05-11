const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Task = require("./task")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is not valid");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be more than 0");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (value.includes("password")) {
        throw new Error("password cannot be password string");
      }
      // if (!value.match(passw)) {
      //   throw new Error("Input Password and Submit [6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter]");
      // }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});


// speficied the virtual columns of task
userSchema.virtual('tasks', {
  ref: "Task", // Task model name
  localField: "_id", // primary key of user model
  foreignField: "owner" // foreign key of task model
})


// overriding of toJSON before JSON.stringify
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

// to generate user authentication by jsonweb token and save the token while registration and login
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECCRET_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;

}

// authentication of user by email id and checkthe password which is been presented in bcyptjs format
userSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login!");
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }

  return user;
}
// hashing the password before updating into the database
userSchema.pre('save', async function (next) {
  const user = this;
  console.log("save midleware runns");
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
})

userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id })
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
