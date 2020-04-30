require("../src/db/mongoose");
const User = require("../src/models/user");

const _id = "5ea1769a92147c3a3478158b";
User.findById({ _id })
  .then((result) => {
    return User.find({ age: result.age });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log("error");
  });
