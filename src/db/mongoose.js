const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://sachin-node-application.herokuapp.com/tast_magaer_api",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);
