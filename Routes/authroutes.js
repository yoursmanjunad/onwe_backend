const express = require("express");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const secret = "mysecretkey";
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, fullName, department } = req.body;

    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
        email: email,
        fullname: fullName,
        department: department,
      });
      res.json("SUCCESS");
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    const decrypt = await bcrypt.compare(password, user.password);
    if (decrypt) {
      const accessToken = jwt.sign(
        { username: user.username, id: user.id },
        secret,
        {
          expiresIn: "7d",
        }
      );

      res.json({ token: accessToken, status: 200 });
      return
    }
     else {
      res.json({ message: "Username or password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
