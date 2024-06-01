import "dotenv/config";

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  
  export const sendMail = (email, verificationToken) => {
    return transport.sendMail({
      to: email,
      from: process.env.MAILTRAP_EMAIL,
      subject: "Welcome to phonebook",
      html: `<h1 style="color: blue"; margin="16px">Verify your account</h1>
        <p style="color: blue">Click on link and approve your registration</p>
        <a href="${process.env.MAILTRAP_HOST}/api/users/verify/${verificationToken}">Approve</a>`,
      text: `Verify your account.Click on link and approve your registration. Please, copy the link - http://localhost:3000/api/users/verify/${verificationToken}`,
    });
  };