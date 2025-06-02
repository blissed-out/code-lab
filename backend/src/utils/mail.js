import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config("../../");

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Code Lab",
    link: "https://aadarshbanjade.com.np",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

export const sendEmailToUser = async (URL) => {
  const email = {
    body: {
      name: "Hello Code Lab ",
      intro: "Welcome to Code Lab! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: URL,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(email);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(email);

  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Wrap in an async IIFE so we can use await.
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: "someone@gmail.com",
    subject: "Hello ✔",
    text: emailText, // plain‑text body
    html: emailBody, // HTML body
  });

  console.log("Message sent:", info.messageId);
};
