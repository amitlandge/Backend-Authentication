require("dotenv").config()
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const User = require("./Model/userSchema");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const auth = require("./Middleware/auth");
app.use(cors());
require("./Database/db").connect();
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Welcome to home route",
  });
});
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name && email && password) {
    res.send("please fill up the imformation");
  }
  const user = await User.findOne({ email });
  if (user) {
    res.send("user already exist");
  }
  const bcryptPass = await bcrypt.hash(password, 10);
  const user_data = await User.create({
    name,
    email,
    password: bcryptPass,
  });
  const generateToken = Jwt.sign({ user_data }, process.env.SECRETE_KEY, {
    expiresIn: "2 week",
  });
  (user_data.password = undefined), (user_data.token = generateToken);

  res.status(200).json({
    success: true,
    user_data,
  });
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.send("please valid information");
  }

  const user = await User.findOne({ email });
  const comparePass = await bcrypt.compare(password, user.password);
  if (user && comparePass) {
    const generateToken = Jwt.sign({ user }, process.env.SECRETE_KEY, {
      expiresIn: "2hr",
    });
    (user.token = generateToken), (user.password = undefined);
    res.json({
      success: true,
      user,
    });
  } else {
    res.json({
      success: false,
      message: "please enter valid information",
    });
  }
});
app.get("/home",auth,(req,res)=>{
res.json({
  success:true,
  message:"Welcome To Home Page"
})
})
app.listen(2000);
