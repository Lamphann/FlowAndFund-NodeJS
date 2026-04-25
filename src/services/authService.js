const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function register(username, email, password) {

  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error("Tài khoản đã tồn tại");

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new Error("Email đã được sử dụng");


  const hashedPassword = await bcrypt.hash(password, 10);


  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  return user.save();
}

async function login(username, password) {

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Sai tài khoản hoặc mật khẩu");
  }


  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Sai tài khoản hoặc mật khẩu");
  }

  return user;
}

module.exports = {
  register,
  login
};