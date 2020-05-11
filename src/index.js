// express module require
const express = require("express");

// install multer library to upload the files
const multer = require('multer');


// load moongose file only once
require("./db/mongoose");

// assigning the express function in app to use in route
const app = express();

// speficify the destination folder to uploa dthe file
const upload = multer({
  //folder name destination
  dest: 'images',
  limits: {
    //file size
    fileSize: 1000000
  },
  //fileFilter method is used to handle the issue like file type, file name, file size
  fileFilter(req, file, cb) {
    //only doc and docx file type allowed
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("file type not allowed!"))
    }
    cb(undefined, true)
  }
})

app.post("/upload", upload.single('upload'), (req, res) => {
  res.send({ success: true })
}, (error, res, req, next) => {
  res.status(400).send(error.message)
})


//specify the port by Heroku app or implicitly
// const port = process.env.PORT || 3000;

//specify the port by Heroku app or implicitly using enviroment variable
const port = process.env.PORT;
//parse incoming json in request object
app.use(express.json());
// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send("Get User is not allowd to access");
//   } else {
//     next();

//   }
// })
const userRouter = require("./routers/user-route");
const taskRouter = require("./routers/task-route");
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("port is listening on " + port);
});

// use bcryptjs to crypt the password to store
// const bcryptjs = require('bcryptjs')

// const secureApp = async () => {
//   const password = "Sachin@123";
//   const bcryptjsPassword = await bcryptjs.hash(password, 8);
//   console.log(bcryptjsPassword);

//   const isMatch = await bcryptjs.compare('Sachin@123', bcryptjsPassword);
//   console.log(isMatch)
// }

// secureApp();

// use jsonwebtoken to generate token and verify a token

// const jsonwebtoken = require("jsonwebtoken")
// const generateTokenExample = async => {
//   const token = jsonwebtoken.sign({ _id: "abc123" }, "secret_key", { expiresIn: "1 seconds" });
//   console.log(token);
//   const tokenVerify = jsonwebtoken.verify(token, "secret_key");
//   console.log(tokenVerify);
// }

// generateTokenExample();

// populate user and task model using populate and execpopulate method.

// const Task = require("./models/task");
// const User = require("./models/user")
// const main = async () => {
//   // const task = await Task.findById("5eb1524348c0a605f1fd6fa7");
//   // await task.populate("owner").execPopulate();
//   // console.log(task)

//   const user = await User.findById("5eb1516448c0a605f1fd6fa4");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// }
// main();


