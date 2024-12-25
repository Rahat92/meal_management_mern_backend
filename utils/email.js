// const nodemailer = require("nodemailer");
// const htmlToText = require("html-to-text");

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.name = user.name;
//     this.url = url;
//     this.form = `Kamrul Hasan khrahat92@gmail.com`;
//   }
//   newTransport() {
//     if (process.env.NODE_ENV === "PRODUCTION") {
//       return nodemailer.createTransport({
//         service: "SendGrid",
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_PASSWORD,
//         },
//       });
//     }
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }
//   async send(template, subject) {
//     const html = "Hello world";
//     const mailOptions = {
//       from: this.form,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html),
//     };
//     await this.newTransport().sendMail(mailOptions);
//   }
//   async sendWelcome() {
//     await this.send("welcome", "Welcome to the Natours Family");
//     }
//     async sendPasswordReset() {
//         await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
//     }
// };

// const Sib = require("sib-api-v3-sdk");
// const client = Sib.ApiClient.instance;
// const apiKey = client.authentications["api-key"];
// apiKey.apiKey =
//   "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";

// const tranEmailApi = new Sib.TransactionalEmailsApi();
// const sender = {
//   email: "khrahat92@gmail.com",
//   name: "Hasan",
// };
// const receivers = [
//   {
//     email: "khrahat150@gmail.com",
//   },
// ];

// tranEmailApi
//   .sendTransacEmail({
//     sender,
//     to: receivers,
//     subject: "Subscribe to Cules Coding to become a developer",
//     textContent: `
//         Cules Coding will teach you how to become a developer.
//         `,
//     // htmlContent: `
//     //     <h1>Cules Coding</h1>
//     //     <a href="https://cules-coding.vercel.app/">Visit</a>
//     //             `,
//     params: {
//       role: "Frontend",
//     },
//   })
//   .then(console.log)
//   .catch(console.log);


const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

sendTransacSms = {
    "sender":"+8801761767178",
    "recipient":"+8801518394910",
    "content":"Hello, How are you today?",
};

apiInstance.sendTransacSms(sendTransacSms).then(function(data) {
}, function(error) {
  console.error(error);
});
