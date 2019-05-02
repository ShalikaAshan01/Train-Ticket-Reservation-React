import axios from 'axios';

export const fn_sendMail = async (data) =>{
    return await axios
        .post(' http://localhost:3000/mail/send',data);
};
