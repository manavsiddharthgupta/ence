const accountSid = 'ACd41e9ab847ab8b5b1c89b36d4bc086ef'
const authToken = '445aa698bc8deb7640549a7fe70d5f02'
const client = require('twilio')(accountSid, authToken)

client.messages
  .create({
    body: 'hi!',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+918840085214'
  })
  /*@ts-ignore*/
  .then(message => console.log(message.sid))
