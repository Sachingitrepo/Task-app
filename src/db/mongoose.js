const mongoose = require("mongoose");
const validator = require("validator");
mongoose.connect("mongodb://localhost:27017/tast_magaer_api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
