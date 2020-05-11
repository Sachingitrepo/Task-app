// express module require
const express = require("express");
const auth = require("../middleware/auth")
//User model to perform the operations.
const User = require("../models/user");
const multer = require("multer");
const { sendEmail, deleteUser } = require("../emails/account")
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("file type not allowed!"))
    }
    cb(undefined, true)
  }
})

// router for user routing
const router = new express.Router();

// ------------------------------------------------User route start-------------------------------------------------------------

// login user by email amd pasword
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    if (!user) {
      return res.status(400).send();
    }
    res.send({ user, token });
  } catch (e) {
    res.status(400).send()
  }

})



//logout specifi user by token 
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      console.log(token.token !== req.token)
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ success: true });
  } catch (e) {
    res.status(500).send();
  }
});


//logout all user at a time
router.post("/allUserLogout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(500).send(e);
  }
})


// create new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  // with asyn and await
  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendEmail(user.email, user.name);
    res.send({ user, token });
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


// get specifiy user by token
router.get("/user/profile", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});


// get all users without being used token
router.get("/all_User", auth, async (req, res) => {
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

// get user by id
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


//delete user by token
router.delete("/user/me", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    deleteUser(user.email, user.name);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//update user by id
router.patch("/user/me", auth, async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedKeys = ["name", "age", "password", "email"];
  const isPresent = keys.every(value => {
    return allowedKeys.includes(value);
  });
  if (!isPresent) {
    return res.status(404).send({ error: "keys does not exists" });
  }
  try {
    keys.forEach((updateKeys) => req.user[updateKeys] = req.body[updateKeys]);
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});


//upload user avatar 
router.post("/user/me/avatar", auth, upload.single('avatar'), async (req, res) => {
  try {
    req.user.avatar = req.file.buffer
    await req.user.save();
    res.send({ success: true })

  } catch (e) {
    res.status(400).send(e);
  }
}, (error, req, res, next) => {
  res.status(400).send(error.message)
})

router.delete("/userProfileRemove", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({ message: "Removed profile pic!" });
  } catch (e) {

  }
})

//get user profile by id
router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user, "user--")

    if (!user || !user.avatar) {
      throw new Error("Does not present!")
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(500).send(e);
  }
})
// ------------------------------------------------User route ends-------------------------------------------------------------

// ------------------------------------------------User route garbage start-------------------------------------------------------------

//update user by id
router.patch("/updateUserById/:id", async (req, res) => {
  const keys = Object.keys(req.body);
  const allowedKeys = ["name", "age", "password", "email"];
  const isPresent = keys.every(value => {
    return allowedKeys.includes(value);
  });
  if (!isPresent) {
    return res.status(404).send({ error: "keys does not exists" });
  }
  try {
    const result = await User.findById(req.params.id);
    keys.forEach((updateKeys) => result[updateKeys] = req.body[updateKeys]);
    await result.save();
    // const result = await User.findByIdAndUpdate(req.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    if (!result) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});


// router.delete("/deleteUserById/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(400).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// ------------------------------------------------User routte garbage ends-------------------------------------------------------------

module.exports = router;
