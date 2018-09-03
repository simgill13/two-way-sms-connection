const env =                                           require('dotenv').config()
const bodyParser =                                    require('body-parser');
const express =                                       require('express');
const mongoose =                                      require('mongoose');
mongoose.Promise =                                    global.Promise;
const app =                                           express();
const path =                                          require('path');
const {bar,order} =                                   require('./model');
const {PORT, DATABASE_URL} =                          require('./config');
var accountSid =                                      env.parsed.ACCOUNT_SID
var authToken =                                       env.parsed.AUTH_TOKEN
var client =                                          require('twilio')(accountSid, authToken); 
var state =                                           {lastNum:'',simsMsg:''}
var state2 =                                          {lastNum2:'',simsMsg2:''}
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));






app.post('/textmsg', (req, res) => {
 console.log('=================HIT==============')
    let prevNumber 
    if(req.body.From === env.parsed.MY_NUMBER) {
        state.simsMsg = req.body.Body
        client.messages.create({ 
          to: state.lastNum, 
          from:   env.parsed.TWILIO_NUMBER,
          body: req.body.Body , 
      }, function(err, message) { 
          console.log(message.sid); 
      });
    }
    if(req.body.From != env.parsed.MY_NUMBER){
        state.lastNum = req.body.From
        client.messages.create({ 
          to:  env.parsed.MY_NUMBER,
          from: env.parsed.TWILIO_NUMBER,
          body: req.body.Body , 
      }, function(err, message) { 
          console.log(message.sid); 
      });
    }
   res.status(200).json({msg: 'this is working'})
})




app.post('/voice', (request, response) => {
  console.log("+++++++++++CALL WAS RECIEVED ++++++++++")
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  twiml.say({ voice: 'alice' }, 'TEST');
  response.type('text/xml');
  response.send(twiml.toString());
});



app.post('/whatsapp', (req, res) => {
  console.log('=================HIT==============')
  let prevNumber 
  if(req.body.From === env.parsed.MY_NUMBER) {
    state2.simsMsg2 = req.body.Body
    console.log('noting')
    client.messages.create({ 
      to: state2.lastNum2, 
      from:env.parsed.TWILIO_NUMBER_WHATSAPP,
      body: req.body.Body , 
  }, function(err, message) { 
      console.log(message.sid); 
  });
  }
  
  if(req.body.From != env.parsed.MY_NUMBER){
    state2.lastNum2 = req.body.From
    client.messages.create({ 
      to: env.parsed.MY_NUMBER_WHATSAPP,
      from:env.parsed.TWILIO_NUMBER_WHATSAPP,
      body: req.body.Body , 
  }, function(err, message) { 
      console.log(message.sid); 
  });
  }
      res.status(200).json({msg: 'this is working'})
 })


















let server;
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}



if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


















