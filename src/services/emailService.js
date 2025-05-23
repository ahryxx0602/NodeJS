require("dotenv").config();
import nodemailer from "nodemailer";

let sendEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Ahryxx" <redcream2004@gmail.com>',
    to: dataSend.receiverEmail,
    subject: dataSend.subject,
    text: "Hello world?", // plain‑text body
    html: `
    <div style="background: #f4f6fb; padding: 40px 0; font-family: Arial, Helvetica, sans-serif;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: bold; color: #007bff; letter-spacing: 1px;">Aura Health</span>
          <div style="width: 60px; height: 3px; background: #007bff; margin: 10px auto 0 auto; border-radius: 2px;"></div>
        </div>
        <h2 style="color: #007bff; text-align: center; margin-bottom: 24px;">Xác nhận đặt lịch khám</h2>
        <p style="font-size: 16px; color: #333;">Xin chào <b>${dataSend.patientName}</b>,</p>
        <p style="font-size: 15px; color: #333;">Bạn nhận được email này vì đã đặt lịch khám online trên <b>Aura Health</b>.</p>
        <div style="background: #f0f4fa; border-radius: 6px; padding: 16px; margin: 18px 0;">
          <p style="margin: 0 0 8px 0; font-size: 15px;"><b>Thời gian:</b> ${dataSend.time}</p>
          <p style="margin: 0 0 8px 0; font-size: 15px;"><b>Bác sĩ:</b> ${dataSend.doctorName}</p>
        </div>
        <p style="font-size: 15px; color: #333;">Lưu ý: Bạn có thể hủy lịch khám trước 1 ngày để được hoàn tiền.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dataSend.redirectLink}" target="_blank" style="display: inline-block; background-color: #007bff; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,123,255,0.15); transition: background 0.2s;">Xác nhận đặt lịch khám</a>
        </div>
        <div style="font-size: 14px; color: #888; text-align: center; margin-top: 24px;">Xin chân thành cảm ơn!<br/>Aura Health</div>
        <div style="text-align: center; margin-top: 18px;">
          <a href="https://www.facebook.com/vanthanh.phan.75286" target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="28" height="28" style="vertical-align: middle; border-radius: 4px;" />
          </a>
          <a href="https://www.instagram.com/ahryxx._/" target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28" height="28" style="vertical-align: middle; border-radius: 4px;" />
          </a>
        </div>
      </div>
    </div>
    `, // HTML body
  });
};

module.exports = {
  sendEmail: sendEmail,
};
