const nodemailer = require("nodemailer");


const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // nbaAPI <noreply@nbaAPI.com>
    to: options.recipient,
    subject: options.subject,
    text: options.message, 
  }

  //send email
  const info = await transporter.sendMail(message)

}

module.exports = sendEmail;