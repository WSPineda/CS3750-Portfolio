const express = require("express");
const routes = express.Router();

routes.route("/session_set").get(async function (req,res){
    console.log("In /session_set, session is " + req.session);
    let status = "";
    if (!req.session.username){
        req.session.username = 'user';
        status = "Session set";
        console.log(status);
    }
    else{
        status = "Session already existed";
        console.log(status);
    }

    const resultObj = { status: status };

    res.json(resultObj);
})

routes.route("/session_get").get(async function (req,res){
    console.log("In /session_get, session is " + req.session);
    let status = "";
    if (!req.session.username){
        status = "No session set";
        console.log(status);
    }
    else{
        status = "Session is in set";
        console.log(status);
    }

    const resultObj = { status: status };

    res.json(resultObj);
})


routes.route("/session_delete").get(async function (req,res){
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ msg: "Failed to log out" });
            }
            res.json({ msg: "Logged out successfully" });
        });
    } else {
        res.json({ msg: "No session found" });
    }
});

module.exports = routes;