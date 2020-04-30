const mongoose = require("mongoose");
try {
  mongoose.connect(
    "mongodb://sachin-node-application.herokuapp.com/tast_magaer_api",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  );
} catch (e) {
  console.log("------------" + e);
  console.log("------------" + process);
}
