var serialize = require('form-serialize')

module.exports = function(param1, callback) {

  var jform = {}
  if(typeof param1 == 'string') jform.form_id = param1 //< String supplied.
  else jform = param1 //< Object supplied

  //Form handler:
  document.getElementById(jform.form_id).addEventListener("submit", function(event){
    event.preventDefault() //< Prevent page reload as per default HTML submit behavior.
    //Convert the form to a tidy little object:
    var formObj = serialize(document.getElementById(jform.form_id), { hash: true })

    if(jform.pre_post) {
      //Call the pre_post function and update the formObj's value to the return
      //value of said function.
      var prePostFormObj = jform.pre_post(formObj)
      //Only update the formObj if a return value was provided:
      if(prePostFormObj) formObj = prePostFormObj
    } else if (jform.post_url) {
      var xhr = new XMLHttpRequest()
      xhr.open("POST", jform.post_url, true)
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8')
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText)
          return callback(formObj, json)
        }
      }
      var data = JSON.stringify(formObj)
      xhr.send(data)
    } else {
      return callback(formObj)
    }
  })
}
