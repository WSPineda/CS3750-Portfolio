const express = require('express');
const fs = require('node:fs');

const router = express();


router.get("/", (req,res)=> {
    const fName = req.query.fName;
    const lName = req.query.lName;
    const favefood = req.query.favefood;
    const fullName = fName + " " + lName;

    fs.appendFile("namefood.txt", content, err =>{
        if(err){
            console.error(err);

        }
    });



    res.send(
        "<html><head></head><body>" +
        "<p>Thank you,  " + req.query.fName +
        " whose favorite food is  " + req.query.favefood + "!</p>" +
        "</body></html>"
    );



});


module.exports = router;

