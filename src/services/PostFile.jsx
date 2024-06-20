import axios from 'axios';
import { URL_DOMINIO } from '../../constantes';

const PostFile = async (url, formData) => {
    try {
        const fullUrl = URL_DOMINIO + url;
        const response = await axios.post(fullUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
        return { exito: false, mensaje: 'Error en la solicitud POST' };
    }
};

export default PostFile;
