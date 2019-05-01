import axios from 'axios'

export const fn_getSpecificPricingInfo = async (type) => {
    return await axios.get(' http://localhost:3000/pricing/'+type);
};
