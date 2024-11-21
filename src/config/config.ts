import dotenv from 'dotenv';
dotenv.config();


const config = {
    port: process.env.PORT || '5001',
    db: process.env.DB_URL||'',
    jwt_secret: process.env.JWT_SECRET || 'This_will_be_my_secret',
    email_host:process.env.EMAIL_HOST||'Gmail',
    email_id:process.env.EMAIL_ID,
    email_pswd:process.env.EMAIL_PASSWORD,
    redis_host:process.env.REDIS_HOST||'redis',
    node_env:process.env.NODE_ENV||'development',
    prod_base_url:process.env.BASE_URL||''
};

export default config;