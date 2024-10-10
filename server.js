//
// This is an Express server-side program that runs as a web app
// inside a web server. Express allows us to get an API --- a set 
// of functions --- up and running quickly as a web service using 
// JavaScript.
//
// Reference: https://expressjs.com/
//

const express = require('express');
const app = express();

// 
// main() for the node.js app:
//
app.listen(3000, () => {
  console.log('**SERVER: web service running, listening on port 3000...');
});

//
// Function: "/"
//
app.get('/', (req, res) => {
  console.log('**SERVER: call to /');

  res.send('<HTML><body><H3>Home page is empty, we are a calculator service!</H3></body></HTML>');
});

//
// API functions:
//
app.get('/incr/:x', (req, res) => {

  try 
  {
    console.log('**call to /incr');

    let x = parseInt(req.params.x);
    
    if (isNaN(x))
      throw new Error("x is not a number");
      
    let y = x + 1;

    res.send(y.toString());

    return;
  }
  catch(err) {
    res.status(400).send(err.message);
  }
});

// add x and y:
app.get('/add/:x/:y', (req, res) => {
  
  console.log('**call to /add');

  res.send('/add not implemented!');

  return;
});

// raise x to the exponent e:
app.get('/pow/:x/:e', (req, res) => {

  console.log('**call to /pow');

  res.send('/pow not implemented!');

  return;
});



