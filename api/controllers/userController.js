const connection = require("../database/appDatabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const qcheck = "SELECT username FROM users WHERE username = ? OR email = ?";
  connection.query(
    qcheck,
    [req.body.username, req.body.email],
    (err, result) => {
      if (err) throw err;
      if (result.length === 1)
        return res.status(400).json("Username, and email must be unique");
      else {
        const q =
          "INSERT INTO users (`username`, `email`, `password`, `firstName`, `lastName`, `coverPic`, `profilePic`, `city`, `website`) VALUES (?)";
        const salt = bcrypt.genSaltSync(10);
        if (req.body.password)
          req.body.password = bcrypt.hashSync(req.body.password, salt);
        const values = [
          [
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.firstName,
            req.body.lastName,
            req.body.coverPic,
            req.body.profilePic,
            req.body.city,
            req.body.website,
          ],
        ];
        connection.query(q, values, (err, result) => {
          if (err) return res.json(err);
          return res.json("Registration successful");
        });
      }
    }
  );
};

const loginUser = async (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  connection.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("user not found");
    const user = data[0];
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json("incorrect password");
    const token = jwt.sign({ id: user.id }, "secretkey");
    const { password, ...others } = user;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json(`Login succesful. Welcome, ${user.firstName}`);
  });
};

const logoutUser = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .json("user logged out successfully");
};

const getProfile = (req, res) => {
  const { accessToken } = req.cookies;

  if (accessToken) {
    jwt.verify(accessToken, "secretkey", {}, (err, user) => {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const followUser = (req, res) => {
  const targetUser = req.params.id;
  const thisUser = req.body.id;
  const qcheck =
    "SELECT id FROM followings WHERE followerUserId = ? AND followedUserId = ?";
  connection.query(qcheck, [thisUser, targetUser], (err, result) => {
    if (err) throw err;
    if (result.length === 1) {
      const q = "DELETE FROM followings WHERE id = ?";
      connection.query(q, result[0].id, (err, result) => {
        if (err) return res.json(err);
        return res.json("Unfollow succesful");
      });
    } else {
      const q =
        "INSERT INTO followings (`followerUserId`, `followedUserId`) VALUES (?)";
      connection.query(q, [[thisUser, targetUser]], (err, result) => {
        if (err) return res.json(err);
        return res.json("Follow succesful");
      });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  followUser,
};
