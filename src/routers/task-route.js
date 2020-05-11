const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth")

const Task = require("../models/task");

// create new task
router.post("/createTask", auth, async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user.id
  })
  try {
    const result = await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});


//Get /filtering  /tasks?completed=true
//Get /paginatin  /tasks?limit=10&skip=20
//Get /sorting    /tasks?sortBy=createdAt:desc
// read all the task
router.get("/getTasks", auth, async (req, res) => {
  const match = {};
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const part = req.query.sortBy.split(":");
    sort[part[0]] = part[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match, // filtering
      options: {
        limit: parseInt(req.query.limit),  // pagination
        skip: parseInt(req.query.skip),    // pagination
        sort                              // sorting
      }
    }).execPopulate();
    console.log(req.user.tasks)
    // const tasks = await Task.find({});
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
  // Task.find({})
  //   .then(result => {
  //     res.status(200).send(result);
  //   })
  //   .catch(err => {
  //     res.status(500).send(err);
  //   });
});




// read task by task id
router.get("/getTaskById/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send([]);
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }

  // Task.findById({ _id })
  //   .then((result) => {
  //     if (!result) {
  //       return res.status(404).send([]);
  //     }
  //     res.send(result);
  //   })
  //   .catch((err) => {
  //     res.status(500).send();
  //   });
});



router.patch("/updateTaskById/:id", auth, async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedUpdates = ["completed", "desc"];
  const isValid = keys.every(value => {
    return allowedUpdates.includes(value);
  });
  if (!isValid) {
    return res.status(400).send({ error: "keys are not valid!" });
  }
  try {
    const task = await Task.findById({ _id: req.params.id, owner: req.user._id });
    keys.forEach((updateKey) => task[updateKey] = req.body[updateKey]);
    await task.save();
    // const result = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   runValidators: true,
    //   new: true
    // });
    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send({ message: "Task has been updated!", status: true });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/deleteTaskById/:id", auth, async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete({ _id: req.params.id, "owner": req.user._id });
    if (!result) {
      return res.status(400).send();
    }
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
