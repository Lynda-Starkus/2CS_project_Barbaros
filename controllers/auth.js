const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
   createJWT,
} = require("../utils/auth");
const { db } = require('../models/User');


exports.signup =  (req, res, next) => {
  let { name, password, password_confirmation } = req.body;  let errors = [];
  if (!name) {
    errors.push({ name: "required" });
  }  if (!password) {
    errors.push({ password: "required" });
  }  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  } User.findOne({name: name})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "name already exists" }] });
       }
       else {
         
        var port_dispo = 0;

        User.find({}).sort({port: -1}).limit(1).exec((err, docs) => { 
            port_dispo = (Number(docs[0].port) + 1).toString();
            console.log(port_dispo);
         const user = new User({
           port: port_dispo,
           name: name,
           password: password,
         }); 
         bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
         if (err) throw err;
         user.password = hash;
         user.save()
             .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
    });
    }
     
  }).catch(err =>{
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
  })
}
exports.signin = (req, res) => {
     let { name, password } = req.body;     let errors = [];
     if (!name) {
       errors.push({ name: "required" });
     }     if (!password) {
       errors.push({ passowrd: "required" });
     }     if (errors.length > 0) {
      return res.status(422).json({ errors: errors });
     }     User.findOne({ name: name }).then(user => {
        if (!user) {
          return res.status(404).json({
            errors: [{ user: "not found" }],
          });
        } else {
           bcrypt.compare(password, user.password).then(isMatch => {
              if (!isMatch) {
               return res.status(400).json({ errors: [{ password:
"incorrect" }] 
               });
              }       let access_token = createJWT(
          user.name,
          user._id,
          3600
       );
       jwt.verify(access_token, process.env.TOKEN_SECRET, (err,
decoded) => {

  
         if (err) {
        
            res.status(500).json({ erros: err });
         }
         if (decoded) {
          
             return res.status(200).json({
                success: true,
                token: access_token,
                message: user
             });
           }
         });
        }).catch(err => {
          console.log("here4")
          //For windows
         //exec("cd C:/Program Files/RealVNC/VNC Viewer");

         //put ip adress of node
         //exec("vncviewer 192.168.43.171:"+user.port);

         //For Linux
         //exec("vncviewer :"+user.port);


        var childProcess = require('child_process');
        childProcess.exec('vncviewer 10.10.1.6:'+user.port, function (err, stdout, stderr) {
        console.log(stdout);
        process.exit(0);// exit process once it is opened
        })
        
          res.body({ erros: err });
        });
      }
   }).catch(err => {
    
      res.status(500).json({ erros: err });
   });
}
