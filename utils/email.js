import nodemailer from 'nodemailer';

//Create Transporter
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "arthvala@gmail.com",
    port: process.env.SMTP_PORT || 465,
    auth:{
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
})