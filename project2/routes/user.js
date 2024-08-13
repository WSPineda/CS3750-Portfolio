const express = require("express");
const fs = require('node:fs');

const router = express();


router.get("/", (req,res)=> {
    const fName = req.query.fname;
    const lName = req.query.lname;
    const favefood = req.query.favefood;
    const fullName = fName + " " + lName;
    const nameAndFavorite = fullName + ", " + favefood + "\n"; 

    fs.appendFile("mydata.txt", nameAndFavorite, err =>{
        if(err){
            console.error(err);

        }
    });



    res.send(
        "<html><head></head><body>" +
        "<p>Thank you, " + fullName +
        " whose favorite food is " + favefood + "!</p>" +
        "</body></html>"
    )



});

module.exports = router;