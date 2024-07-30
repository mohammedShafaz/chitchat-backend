import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service: config.email_host,
    auth: {
        user: config.email_id,
        pass: config.email_pswd,
    }

});

const sentOtp = async (email: string, purpose: string, otp: string) => {
    try {
        const mailOptions = {
            from: config.email_id,
            to: email,
            subject: 'Verification OTP',
            text: ` Welcome to chit chat!\n     your otp for ${purpose} is : ${otp}.\n The otp will be expired in 5 minutes.`
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

export default { sentOtp };