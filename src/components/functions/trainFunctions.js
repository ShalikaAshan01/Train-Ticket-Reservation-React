import axios from 'axios'

export const fn_addTrain = async (data,header) =>{
    return await axios
        .post(' http://localhost:3000/trains', data,header);

};
export const fn_getAllTrain = async () =>{
    return await axios
        .get(' http://localhost:3000/trains');

};

export const fn_checkAvailability = async (data) =>{
    return await axios
        .get(' http://localhost:3000/trains/check/availability',{params:data});

};


