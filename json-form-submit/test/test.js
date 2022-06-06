var test = require('tape')

test("An object containing all fields in form is supplied after clicking form's button", (t) => {
  t.plan(1)
  console.log(   'file://' + process.cwd() + '/test/example.html'  )

  var Nightmare = require('nightmare'), 
      nightmare = new Nightmare({
        show : true, 
        openDevTools : true
      })

  nightmare
    .goto('file://' + process.cwd() + '/test/example.html')
    .type('[name="First Name"]', 'Ron')
    .type('[name="Last Name"]', 'Paul')
    .click('button')
    .wait(2500)
    .end() 
    .evaluate(() => document.getElementById('thanks').innerHTML)
    .then((result) => {
      t.equals(result, 'Thanks Ron Paul!')
    })
})

test("Form obj is sent to server and returns with result", (t) => {
  t.plan(6)

  var Nightmare = require('nightmare'), 
      nightmare = new Nightmare({
        show : true, 
        openDevTools : true
      })

  //Establish an express server and post route the form will hit: 
  var express = require('express'), 
      app = express(), 
      bodyParser = require('body-parser')

  app.use(bodyParser.json()) //< Parse incoming JSON: 

  app.get('/example2', (req, res) => res.sendFile(process.cwd() + '/test/example2.html'))
  app.get('/example2.bundle.js', (req, res) => res.sendFile(process.cwd() + '/test/example2.bundle.js'))

  app.post('/example2', (req, res) => {
    console.log(req.body)
    res.send({ msg : 'everything server-side A-OK!'})
  })

  var server = app.listen(8126, () => console.log('express server listening') )

  nightmare
    .goto('http://localhost:8126/example2')
    .type('[name="username"]', 'fluffypony')
    .type('[name="password"]', 'stuff')
    .click('button')
    .wait(1000)
    .end() 
    .evaluate(() => {
      var results = {}
      results.thanks =  document.getElementById('thanks').innerHTML 
      results.response = document.getElementById('response').innerHTML  
      results.errs = errs 
      results.submissionCount = submissionCount
      return results   
    })
    .then((results) => {
      console.log(results)
      t.equals(results.thanks, 'Thanks for registering fluffypony!')
      t.equals(results.response, 'everything server-side A-OK!') 
      t.equals(results.submissionCount, 1, 'the form was submitted only one time')
      t.equals(results.errs.no_form, 0, 'the form was always included in callback')
      t.equals(results.errs.no_res, 0, 'the response from server was always included in callback')   
      t.equals(results.errs.no_msg, 0, 'there was always a message from server included in callback')         
      server.close() 
    })
})
