import axios from 'axios';
import { URL_DOMINIO } from '../../constantes';

const Get = async (url, params) => {
    try {
        url = URL_DOMINIO + url;
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        return error;
    }
}

export default Get;
