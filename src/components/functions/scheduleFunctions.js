import axios from 'axios';

export const fn_addSchedule = async (data) =>{
    return await axios.post(' http://localhost:3000/schedules', data);
};

export const fn_getSpecificSchedule = async (data) =>{
    return await axios.get(' http://localhost:3000/schedules/'+data.date+"/"+data._tid);
};

