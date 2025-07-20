const nodemailer=require('nodemailer');

const sendEmail=async(option)=>{
// CREATING A TRANSPORTER
const transporter=nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port: process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const emailOptions={
    from: 'STOCK-TRACKER support<support@stocktracker.com>',
    to: option.email,
    subject: option.subject,
    text: option.message
}
    await transporter.sendMail(emailOptions);
}

module.exports=sendEmail;