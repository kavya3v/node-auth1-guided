const router = require("express").Router();
const Users = require("./users-model.js");
//middleware to check session existence
const loginCheck = require("../auth/loggedin-check-middleware");

router.get("/",loginCheck, (req, res) => {
// router.get("/",restrict, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

 
module.exports = router;
