const express = require("express");
const fs = require('node:fs');

const router = express();


router.get("/", (req,res)=> {

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>List of Entries</title>
    </head>
    <body>
        <h1>List of Entries</h1>
        <table border="1">
            <tr>
                <th>Name</th>
                <th>Food</th>
              
            </tr>`;
  
    fs.readFile('mydata.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const rows = data.split('\n');
      rows.forEach((row, index) => {
        if (index > -1) { 
          const columns = row.split(',');
          html += `
            <tr>
                <td>${columns[0]}</td>
                <td>${columns[1]}</td>
               
            </tr>`;
        }
      });
  
      html += `
        </table>
    </body>
    </html>`;
  
      res.send(html);
    });
  



});

module.exports = router;