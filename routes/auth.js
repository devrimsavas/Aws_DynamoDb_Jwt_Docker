

var express = require('express');
var router = express.Router();

const path=require('path');
const fs=require('fs');

//import AWS config file and Database config file
const {docClient}=require('../aws-config.js');
const {s3}=require('../aws-config.js');

//bcrypt password 
const bcrypt=require('bcrypt');

//jwt
const jwt=require('jsonwebtoken');


/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page' });
});


router.post('/login', function(req, res, next) {
  let {email, password} = req.body;

  if (!email || !password) {
    res.status(400).json({
      statusCode: 400,
      message: "All fields are required"
    })
  }

  let getParams={
    TableName:"UserCredentials",
    Key:{
      email  // why only email because email is the key in table 
      
    }
  };

  //if user exists in database retrieve password
  docClient.get(getParams,function(err,data) {
    if (err) {
      console.error("Unable to get item. Error JSON: ", JSON.stringify(err, null, 2));
      res.status(500).json({
        statusCode: 500,
        message: "Failed to get item"
      })
    }
    //check user to
    if (!data.Item) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found"

      });
    }

    //compare password 
    bcrypt.compare(password,data.Item.Password,function(err,result) {
      if (err) {
        console.error("Unable to compare password. Error JSON: ", JSON.stringify(err, null, 2));
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to compare password"
        });
      } //end of compare password
      console.log("Password match: ", result);
      console.log(password, data.Item.Password);

      if (result) {
        //password match create jwt 
        const token=jwt.sign(
          {
            email:data.Item.email
          },
          process.env.TOKEN_SECRET,
          {expiresIn:'1h'}
        );

        res.cookie('token',token, {httpOnly:true,secure:true});
        return res.status(200).json({
          statusCode: 200,
          message: "Login successful",
          user: {
            email:data.Item.email
          }
        });
      } else {
        return res.status(401).json({
          statusCode: 401,
          message: "Incorrect password or email"
        });
      }
    });
  }); 


    

})//end of get 




//sign up page get 
router.get('/signup',function(req,res,next) {
  res.render('signup', { title: 'Sign Up Page' });
})


//sign up page post

router.post('/signup', function(req, res, next) {
  // Get data from form
  let {username, email, password} = req.body;
  console.log(username, email, password);

  // Check if all fields are filled
  if (!username || !email || !password) {
    res.status(400).json({
      statusCode: 400,
      message: "All fields are required"
    });
    return;
  }

  // Bcrypt hash password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
    if (err) {
      console.error("Unable to hash password. Error JSON: ", JSON.stringify(err, null, 2));
      res.status(500).json({
        statusCode: 500,
        message: "Failed to hash password"
      });
      return; // Ensure function exits here if there is an error
    }

    // Create params for new database table
    const params = {
      TableName: "UserCredentials",
      Item: {
        email: email,  // Make sure the key names match exactly what's defined in DynamoDB
        Username: username,
        Password: hashedPassword
      }
    };

    // Insert this into credentials database with put operation
    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON: ", JSON.stringify(err, null, 2));
        res.status(500).json({
          statusCode: 500,
          message: "Failed to add user"
        });
      } else {
        // Sign JWT token
        const token = jwt.sign(
          { email: email, username: username }, // Don't include passwords in tokens
          process.env.TOKEN_SECRET,
          { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true });

        // Return success message
        res.status(200).json({
          statusCode: 200,
          message: "User registered successfully",
          username: username,
          email: email
        });
      }
    }); // End of docClient.put
  }); // End of bcrypt.hash
}); // End of post signup


//logout 
router.get('/logout',function(req,res,next) {
  res.clearCookie('token');
  res.redirect('/');
});



module.exports = router;