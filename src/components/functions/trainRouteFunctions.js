import axios from 'axios'

/**
 * this method will add new line
 * @param data
 * @param header
 * @returns {Promise<any>}
 */
export const addLineFunction = async (data,header) =>{
    return await axios
        .post(' /line', {
            line: data.line,
            from: data.from,
            to: data.to,
            stations: data.stations,
        },header);

};
/**
 * this ajax call will return all routes
 * @returns {Promise<any>}
 */
export const showRoutes = async () =>{
    return await axios
        .get(' /line');

};
/**
 * this ajax call will get specific line by its own name
 * @param data
 * @returns {Promise<any>}
 */
export const showRoutesbyLine = async (data) =>{
    return await axios
        .get('  /line/'+data);

};
