import otpGenerator from 'otp-generator';
import redisClient from './redis';

const generateOtp = (): string => {

    return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
};

const storeOtp = async (email: string, otp: string): Promise<void> => {
    try {
        await redisClient.set(`otp:${email}`, otp, { EX: 300 });
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw new Error('Failed to store OTP');
    }
};

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (storedOtp === otp) {
            await redisClient.del(`otp:${email}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP');
    }
};

export default { generateOtp, storeOtp, verifyOtp };
