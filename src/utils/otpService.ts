import otpGenerator from 'otp-generator';
import { createClient } from 'redis';
import config from '../config/config';

const redisHost= config.redis_host;

const otpClient = createClient({
    url:`redis://${redisHost}:6379`
});

otpClient.on('error', (err) => {
    console.error('Redis client error', err);
});

otpClient.connect();



const generateOtp = (): string => {

    return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
};

const storeOtp = async (email: string, otp: string): Promise<void> => {
    try {
        await otpClient.set(`otp:${email}`, otp, { EX: 300 });
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw new Error('Failed to store OTP');
    }
};

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
        const storedOtp = await otpClient.get(`otp:${email}`);
        if (storedOtp === otp) {
            await otpClient.del(`otp:${email}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP');
    }
};

export default { generateOtp, storeOtp, verifyOtp };
