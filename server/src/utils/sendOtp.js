import nodemailer from "nodemailer";

export async function sendOtpEmail({ to, otp }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
    rejectUnauthorized: false, // ✅ fix self-signed certificate error
  },
  });

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 10 minutes.</p>`
  });

  console.log("✉️  OTP mail sent:", info.messageId);
  return info;
}
