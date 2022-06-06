var jsonForm = require('../json-form-submit.js')

window.errs = {
  no_form : 0, 
  no_res : 0, 
  no_msg : 0
}

window.submissionCount = 0

jsonForm({
  form_id: 'example2', 
  post_url: 'http://localhost:8126/example2', 
}, (form, res) => {
  submissionCount++; 
  console.log(form)
  console.log(res)
  if(!form){
    errs.no_form++; 
    return document.getElementById('thanks').innerHTML = 'there is no form!'
  }
  if(!res) {
    errs.no_res++;
    return document.getElementById('thanks').innerHTML = 'there is no server response!'  
  }
  if(!res.msg) {
    errs.no_msg++;
    return document.getElementById('thanks').innerHTML = 'there is no message from server!'
  }
  document.getElementById('thanks').innerHTML = `Thanks for registering ${form.username}!`
  document.getElementById('response').innerHTML = res.msg  
})
