##  JSON Form Submit

Client-side AJAX form handler that simplifies submissions while giving you control.

It leverages the browser's default behavior of handling form submissions (gives you free validation/UI for things like email or required fields) while preventing the actual form submission so you can handle that yourself. 


Install: 
```
npm install json-form-submit
```


Usage:

```html
<!-- HTML: -->
<form id="register">
    <input name="first_name" required />
    <input name="last_name" />
    <button>Register</button>                
</form>
```

```javascript
//JS (via browserify)
var jsonForm = require('json-form-submit')

jsonForm('register', function(form) { //< First parameter is the ID of your form.
  //Form passed validation and now you have a clean object containing the form data:  
  console.log(form) //< { first_name: 'Jaromir', last_name: 'Jagr' }    
})

```

You can also supply a post URL and a pre-post function.  To do this, supply an object followed by the callback.  If you do it this way, the callback will return with an extra object containing the response from the post event.  Ex: 

```javascript
jsonForm({
  form_id: 'register', 
  post_url: 'http://localhost:4550/register', 
  pre_post: function(form) {
      console.log(form) //< { first_name: 'Jaromir', last_name: 'Jagr' }    
      //Do stuff before form submitted to server (custom validation, change DOM to reflect "submitting" state, etc):
      $('button').html('registering...')
      $('#spinner').show()
    }
  }, function(form, res) {
    //Form has been posted to server, now do stuff
    //(reset DOM state, handle response, etc):
    $('button').html('Register')
    $('#spinner').hide()
    if(res.ok) alert('Your account was created!')
    else alert('It broke.')
  })
```

