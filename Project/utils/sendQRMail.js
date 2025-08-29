const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function sendQRMail(email, qrImage, eventTitle) {
  await transporter.sendMail({
    from: "Glubs <no-reply@glubs.com>",
    to: email,
    subject: `E-Pass for ${eventTitle}`,
    html: `<p>Here is your event QR:</p><img src="${qrImage}" alt="QR Code" style="width:200px;"/>`,
  });
};
