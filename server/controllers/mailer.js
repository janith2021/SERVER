const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const Axios = require('axios');

let config = {
  service: "gmail",
  auth: {
    user: "onlinesite1998@gmail.com",
    pass: 'vgjhtwpymglcbzsb',
  },
};

let transport = nodemailer.createTransport(config)

let mailgenerate = new mailgen({
  theme: "neopolitan",
  product: {
    name: "Fight The Bites Team",
    link: "https://mailgen.js/",
    copyright : "Fight The Bites 2023. All Rights Reserved."

  },
});

const smssender = async (to,message) => {

  var user = process.env.SMSUSER
  var apikey = process.env.SMSAPIKEY 

  var res = await Axios.post(`https://app.notify.lk/api/v1/send?user_id=${user}&api_key=${apikey}&sender_id=NotifyDEMO&to=${to}&message=${message}`)
  // var res = await Axios.post('https://webhook.site/06c6373a-2420-4fa2-a061-8effd34ba09b')
  return res;

}

module.exports = {mailgenerate,transport,smssender};
