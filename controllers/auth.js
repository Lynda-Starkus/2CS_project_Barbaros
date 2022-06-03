const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const {
   createJWT,
} = require("../utils/auth");

exports.signup = (req, res, next) => {
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
       }else {
         const port_dispo = fs.readFileSync('../PORT_ASSIGN.txt','utf-8');
         const user = new User({
           port: port_dispo,
           name: name,
           password: password,
         }); bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
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
      const update_port_dispo = Number(port_dispo);
      update_port_dispo = update_port_dispo + 1;

      const txtWrite = update_port_dispo.toString();

      fs.writeFileSync('./text/writefile.txt', txtWrite);
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
     }     if (!emailRegexp.test(name)) {
       errors.push({ name: "invalid name" });
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
          res.status(500).json({ erros: err });
        });
      }
   }).catch(err => {
      res.status(500).json({ erros: err });
   });
}