import axios from 'axios'

/**
 * this ajax request will call add train api
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
export const fn_addTrain = async (data,header) =>{
    return await axios
        .post(' /trains', data,header);

};
/**
 * this ajax call will return all train information
 * @returns {Promise<any>}
 */
export const fn_getAllTrain = async () =>{
    return await axios
        .get(' /trains');

};
/**
 * in this ajax call will return available trains by given date
 * @param data
 * @returns {Promise<any>}
 */
export const fn_checkAvailability = async (data) =>{
    return await axios
        .get(' /trains/check/availability',{params:data});

};


