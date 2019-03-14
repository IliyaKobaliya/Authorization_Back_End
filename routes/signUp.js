const express = require('express');
const router = express.Router();
const User = require("../models/user");
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();

router.post('/', function (req, res) {
    return User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(409).json({error: "This email registrated already"});
        }
        const token = uidgen.generateSync();
        const {email, password, firstName, lastName} = req.body;
        new User({email, password, firstName, lastName, token}).save().then(() =>
            res
                .status(201)
                .header("Access-Control-Allow-Credentials", true)
                .cookie("token", token)
                .json({email: req.body.email, token})
        );
    });
});
module.exports = router;