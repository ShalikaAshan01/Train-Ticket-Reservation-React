import axios from 'axios';

export const fn_sendMail = async (data) =>{
    return await axios
        .post(' http://localhost:3000/mail/send',data);
};
export const fn_sendSMS = async (data) =>{
    return await axios
        .post(' http://localhost:3000/mail/send/sms',data);
};
