const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"GLUBS Team 👨‍💻" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
            attachments: options.qrImageBase64
        ? [
            {
              filename: "qrcode.png",
              content: options.qrImageBase64.split("base64,")[1],
              encoding: "base64",
              cid: "qrcodeimg", // same as used in HTML: <img src="cid:qrcodeimg">
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Actual email error:", err);
    throw err;
  }
};

module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: `"GLUBS Team 👨‍💻" <${process.env.EMAIL_USER}>`,
//       to: options.email,
//       subject: options.subject,
//       html: options.html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.response);
//   } catch (err) {
//     console.error("❌ Actual email error:", err); // <--- REAL ERROR
//     throw err;
//   }
// };

// module.exports = sendEmail;
