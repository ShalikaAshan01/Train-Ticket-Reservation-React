import axios from 'axios'

/**
 * this ajax call will create new user
 * @param newUser
 * @returns {Promise<any>}
 */
export const signupFunction = async newUser =>{
    return await axios
        .post('/users/signup', {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            telephoneNumber: newUser.telephoneNumber,
            password: newUser.password,
        });

};
/**
 * this ajax call can be sign in user
 * @param data
 * @returns {Promise<any>}
 */
export const signinFunction = async data =>{
    return await axios
        .post('/users/signin', {
            email: data.email,
            password: data.password,
        });

};
/**
 * this ajax request can update user information
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
export const fn_updateProfile = async (data,header )=>{
    return await axios
        .patch('/users/'+data._id, data,header);

};
/**
 * this ajax request will update user's password
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
export const fn_updatePassword = async (data,header )=>{
    return await axios
        .put('/users/'+data._id+'/changepassword', data,header);

};
/**
 * this ajax call will be validate user
 * @param data
 * @returns {Promise<any>}
 */
export const validateUser = async data=>{
    return await axios
        .post('/users/'+data._id+"/"+data._token,{})
};
