import axios from 'axios';

/**
 * this method will add schedule
 * @param data
 * @returns {Promise<any>}
 */
export const fn_addSchedule = async (data) =>{
    return await axios.post(' http://localhost:3000/schedules', data);
};

/**
 * this ajax call will get schedule
 * @param data
 * @returns {Promise<any>}
 */
export const fn_getSpecificSchedule = async (data) =>{
    return await axios.get(' http://localhost:3000/schedules/'+data.date+"/"+data._tid);
};
/**
 * this ajax call will make reservation
 * @param data
 * @param header
 * @returns {Promise<any>}
 */

export const fn_makeReservation = async (data,header) =>{
    return await axios.put(' http://localhost:3000/schedules/'+data.trainID+"/"+data.date,data,header);
};
/**
 * this ajax call can get reservation by userID
 * @param uid
 * @returns {Promise<any>}
 */
export const fn_getReservationByUID = async (uid) =>{
    return await axios.get(' http://localhost:3000/schedules/'+uid);
};

