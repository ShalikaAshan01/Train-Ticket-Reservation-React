import axios from 'axios'

export const addLineFunction = async (data,header) =>{
    return await axios
        .post(' http://localhost:3000/line', {
            line: data.line,
            from: data.from,
            to: data.to,
            stations: data.stations,
        },header);

};
export const showRoutes = async () =>{
    return await axios
        .get(' http://localhost:3000/line');

};
export const showRoutesbyLine = async (data) =>{
    return await axios
        .get('  http://localhost:3000/line/'+data);

};
