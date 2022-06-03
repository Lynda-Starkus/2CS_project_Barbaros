const mongoose = require('mongoose');
const Schema = mongoose.Schema;let userSchema = new Schema({
   name:{
      type: String,
      required: true
   },
   port: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
},{
   timestamps: true,
   collection: 'users'
})

module.exports = mongoose.model('User', userSchema);