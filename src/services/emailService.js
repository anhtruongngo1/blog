require('dotenv').config();
import nodemailer from "nodemailer";


let sendSimpleEmail =async(dataSend) => {
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Truong ngo 👻" <truong01288639596@gmail.com', // sender address
    to: dataSend.reciveEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
    html: `
     <h3> Xin chào khách hàng ${dataSend.patientName} !</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online </p>
      <p>Thông tin đặt lịch khám bệnh </p>
      <div> <b>  thời gian: ${dataSend.timeType}   </b>    </div>
      <div> <b>  bác sĩ: ${dataSend.doctorName}   </b>    </div>

      <p>    Nếu các thông tin là đúng please click vào đường link để hoàn tất </p>
      <div> <a href="${dataSend.redirectLink}"  target="_blank"> Click here </a> </div>
     `, // html body
  });
}


let sendAttachment = async(dataSend) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Truong ngo 👻" <truong01288639596@gmail.com', // sender address
        to: dataSend.email, // list of receivers
        subject: "kết quả đặt lịch khám bệnh ✔", // Subject line
        attachments: [
          {   // encoded string as an attachment
            filename: `remedy-${dataSend.patientId}.png`,
            content: dataSend.imageBase64.split("base64,")[1],
            encoding: 'base64',
        }
        ] ,
        html: `
         <h3> Xin chào khách hàng ${dataSend.patientName} !</h3>
         <p> Bạn nhận được mail này vì đã hoàn thành việc khám bệnh ở hệ thống của chúng tôi </p>
         <p>Thông tin đơn thuốc / hóa đơn của bạn sẽ được gởi trong file đính kèm </p>
         <div> xin chân thành cảm ơn </div>

         `, // html body
      });
}
module.exports = {
  sendSimpleEmail,
  sendAttachment
}