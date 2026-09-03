const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.sendMail({
  from: '"Rahul" <admin@websynergystudiollc.online>',
  to: 'mrkashif9758@gmail.com',
  subject: 'SMTP Test from MailBlaster',
  html: '<p>SMTP test from node</p>',
}, (err, info) => {
  if (err) {
    console.error('SEND_ERROR', err.message);
    process.exit(1);
  }
  console.log('SEND_OK', info.messageId);
  process.exit(0);
});
