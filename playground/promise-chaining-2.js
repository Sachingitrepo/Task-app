require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findById({ _id })
//   .then((result) => {
//     return Task.remove({ completed: true });
//   })
//   .then((result) => {
//     console.log(result);
//   });

// const findUserById = async (_id) => {
//   const task = await Task.findById({ _id });
//   const userCount = await Task.countDocuments({ completed: false });
//   return userCount;
// };

// findUserById("5ea2ae7c6841732c101fde2a")
//   .then((userCount) => {
//     console.log(userCount);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const deleteAndCount = async (_id) => {
  const userDelete = await Task.deleteOne({ _id });
  const count = await Task.countDocuments();
  return count;
};

deleteAndCount("5ea2ae7c6841732c101fde2a").then((res) => {
  console.log(res);
});
