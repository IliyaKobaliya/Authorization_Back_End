const express = require('express');
const router = express.Router();
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
const User = require("../models/user");
/* GET home page. */
router.post('/', function (req, res) {
    const token = uidgen.generateSync();
    return User.findOne({email: req.body.email}).then(user => {
        console.log(user);
        if (!user) {
            return res.status(403).json({error: "Wrong email or password"});
        }
        if (user.password !== req.body.password) {
            return res.status(403).json({error: "Wrong email or password"});
        }
        return User.findOneAndUpdate({email: req.body.email}, {token}).then(() => {
            res
                .status(201)
                .header("Access-Control-Allow-Credentials", true)
                .cookie("token", token)
                .json({email: req.body.email, token});
        });
    });
});
module.exports = router;