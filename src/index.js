// express module require
const express = require("express");

// load moongose file only once
require("./db/mongoose");

//Task model to perform the operations.
const Task = require("./models/task");

// assigning the express function in app to use in route
const app = express();

//specify the port by Heroku app or implicitly
const port = process.env.PORT || 3000;

//parse incoming json in request object
app.use(express.json());

const userRouter = require("./routers/user-route");
const taskRouter = require("./routers/task-route");
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("port is listening on " + port);
});
