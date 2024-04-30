const  express = require('express');
const router = express.Router();

const path=require('path');
const fs=require('fs');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//import AWS config file and Database config file



const {docClient}=require('../aws-config.js');
const {s3}=require('../aws-config.js');

//import JWT middleware to protect all routes here
const verifyToken = require('../authMiddleware.js');
//use JWT middleware
router.use(verifyToken);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dynamodb', { title: 'Amazon DynamoDB' });
});

module.exports = router;


// post for new user

router.post('/newentry',function(req,res,next) {

  let {name,surname,age,email}=req.body;
  //test 
  console.log(req.body);

  //be sure all fields are filled in
  if (name == "" || surname == "" || age == "" || email == "") {
    res.status(400).json({
      statusCode: 400,
      message: "All fields are required"
    })
    return;
  }

  // critic element we create a new user 
  //table name: user_info_table 
  let putParams={
    TableName:"user_info_table",
    Item: {
      email,  //email is the key
      name,
      surname,
      age
    }
  };

  //we insert this data to the database
  docClient.put(putParams,function(err,data) {
    if (err) {
      console.error("Unable to add item.Error Json ",JSON.stringify(err,null,2));
      res.status(500).json({
        statusCode:500,
        message:"Failed to add user"
      })
    } else {
      console.log("Added item",JSON.stringify(data,null,2));
      res.json({
        statusCode:200,
        message:"User added successfully",
        user: {
          email:putParams.Item.email,
          name:putParams.Item.name,
          surname:putParams.Item.surname,
          age:putParams.Item.age
        }
      })
      
    }
  })

}) 


// get for all users
router.get('/getall',function(req,res,next) {
  console.log("all users requested");

  const params= {
    TableName:"user_info_table"
  };
  
  docClient.scan(params,function(err,data) {
    if (err) {
      console.error("Unable to scan table. Error JSON ",JSON.stringify(err,null,2));
      res.status(500).json({
        "unable to scan table":JSON.stringify(err,null,2)
      })


    } else {
      console.log("Scan succeeded",JSON.stringify(data,null,2));
      res.status(200).json( {        
        data:data.Items

      });
    }
  })
})

//delete user 
router.delete('/deleteuser',function(req,res,next) {
  let email=req.body.email 

  if (!email) {
    return res.status(500).json({
      statusCode:500,
      message:"Email is required"
    })

  }
  console.log("delete user requested",email);
  //we get parameters 
  let deleteParams= {
    TableName:"user_info_table",
    Key:{
      email
    }
  };

  //delete 
  docClient.delete(deleteParams,function(err,data) {

    if (err) {
      console.error("Unable to delete item. Error JSON ",JSON.stringify(err,null,2));
      res.status(500).json({
        statusCode:500,
        message:"Failed to delete user"
      })
    } else {
      console.log("Deleted item",JSON.stringify(data,null,2));
      res.status(200).json({
        statusCode:200,
        email:email
      });
    }
  });



}); //end delete route 


//update route 
router.post('/updateuser',function(req,res,next) {
  const {name,surname,age,email}=req.body;
  //test 
  console.log(req.body);
  if (!email) {
    return res.status(500).json({
      statusCode: 400,
      message: "Email is required to update"
    })
  }
  let updateParams= {
    TableName:"user_info_table",
    Key: {
      email:email
    },
    UpdateExpression:"set #name= :n, surname=:s, age=:a",
    ExpressionAttributeNames:{
      "#name":"name",
  },
  ExpressionAttributeValues:{
    ":n":name,
    ":s":surname,
    ":a":age
  },
  ReturnValues:"UPDATED_NEW"
  };

  //update item 
  docClient.update(updateParams,function(err,data) {
    if (err) {
      console.error("Unable to update item. Error JSON ",JSON.stringify(err,null,2));
      res.status(500).json({
        statusCode:500,
        message:"Failed to update user"
      })
    } else {
      console.log("Updated item",JSON.stringify(data,null,2));
      res.json({
        statusCode:200,
        message:"User updated successfully",
        user: {
          email:email,
          name:data.Attributes.name,
          surname:data.Attributes.surname,
          age:data.Attributes.age
        }
      });
    }
  });


});

module.exports=router;
