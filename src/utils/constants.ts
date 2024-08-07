import config from "../config/config";

export const API_VERSION = 'v1';
export const BASE_PATH = `/api/${API_VERSION}`;
export const hashSalt = 10;
export const EMAIL_PURPOSE = {
    registration: 'registration',
    reset_pass: 'reset password',
    forgot_pass: 'forgot password'
}
export const baseUrl = `http://localhost:${config.port}/assets/uploads`;
