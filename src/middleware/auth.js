const jwt = require("jsonwebtoken");
const User = require("../models/user")
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decode = jwt.verify(token, process.env.JWT_SECCRET_KEY);
        const user = await User.findOne({ "_id": decode._id, "tokens.token": token })
        if (!user)
            throw new Error({ error: "user is not authenticated!" });
        req.token = token;
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send({ error: "user is not authenticated!" });
    }

}

module.exports = auth;