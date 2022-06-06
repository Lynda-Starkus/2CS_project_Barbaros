var jsonForm = require('../json-form-submit.js')

console.log('hello world')

jsonForm('example', (form) => {
  console.log(form)
  document.getElementById('thanks').innerHTML = `Thanks ${form['First Name']} ${form['Last Name']}!`
})
