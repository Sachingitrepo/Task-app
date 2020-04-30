// express module require
const express = require("express");

//User model to perform the operations.
const User = require("../models/user");

// router for user routing
const router = new express.Router();

// ------------------------------------------------User route-------------------------------------------------------------

router.patch("updateUserById/:id", async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedKeys = ["name", "age"];
  const isPresent = keys.every(value => {
    return allowedKeys.includes(value);
  });
  if (!isPresent) {
    return res.status(404).send({ error: "keys does not exists" });
  }
  try {
    const result = await User.findByIdAndUpdate(req.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!result) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  // with asyn and await
  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }

  // with promise
  // user
  //   .save()
  //   .then((result) => {
  //     res.send(user);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

router.get("/allUser", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (e) {
    res.status(500).send(err);
  }
  // User.find({})
  //   .then((result) => {
  //     res.status(200).send(result);
  //   })
  //   .catch((err) => {
  //     res.status(500).send(err);
  //   });
});

router.get("/getUserById/:id", async (req, res) => {
  const _id = req.params.id;
  // User.findById({ _id })
  //   .then((result) => {
  //     if (!result)
  //       return res
  //         .status(404)
  //         .send({ error: "User is not present", errorCode: 404 });

  //     res.send(result);
  //   })
  //   .catch((err) => {
  //     return res
  //       .status(500)
  //       .send({ error: "Internal server error", errorCode: 500 });
  //   });
  try {
    const result = await User.findById({ _id });
    if (!result) {
      return res
        .status(404)
        .send({ error: "User is not present", errorCode: 404 });
    }
    res.send(result);
  } catch (e) {
    return res
      .status(500)
      .send({ error: "Internal server error", errorCode: 500 });
  }
});

router.delete("/deleteUserById/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
