var sms = require('./smsc_api');

sms.configure({
  login: 'admin',
  password: 'password'
})

sms.test((err) => {
  if(err) return console.log("SMS/Error: " + err)
})

module.exports = sms;
