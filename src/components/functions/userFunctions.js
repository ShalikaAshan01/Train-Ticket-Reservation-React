import axios from 'axios'

export const signupFunction = async newUser =>{
    return await axios
        .post(' http://localhost:3000/users/signup', {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            telephoneNumber: newUser.telephoneNumber,
            password: newUser.password,
        });

};
export const signinFunction = async data =>{
    return await axios
        .post('http://localhost:3000/users/signin', {
            email: data.email,
            password: data.password,
        });

};

export const validateUser = async data=>{
    return await axios
        .post('http://localhost:3000/users/'+data._id+"/"+data._token,{})
};
