const express = require("express");
const router = new express.Router();

const Task = require("../models/task");

// read all the task
router.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
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
router.get("/getTaskById/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById({ _id });
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

router.post("/createTask", async (req, res) => {
  const task = new Task(req.body);
  try {
    const result = await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/updateTaskById/:id", async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedUpdates = ["completed", "desc"];
  const isValid = keys.every(value => {
    return allowedUpdates.includes(value);
  });
  if (!isValid) {
    return res.status(400).send({ error: "keys are not valid!" });
  }
  try {
    const result = await Task.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });
    if (!result) {
      return res.status(404).send();
    }

    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/deleteTaskById/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(400).send();
    }
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
