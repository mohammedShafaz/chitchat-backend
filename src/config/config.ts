import dotenv from 'dotenv';
dotenv.config();


const config = {
    port: process.env.PORT || '5001',
    db: process.env.DB_URL||'mongodb+srv://shafazfaizal:zUnsyfHSCrq59xSx@chitchat.yao4cws.mongodb.net/',
    jwt_secret: process.env.JWT_SECRET || 'This_will_be_my_secret',
    email_host:process.env.EMAIL_HOST||'Gmail',
    email_id:process.env.EMAIL_ID,
    email_pswd:process.env.EMAIL_PASSWORD
};

export default config;