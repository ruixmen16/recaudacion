import axios from 'axios'
import { URL_DOMINIO } from '../../constantes'

const Post = async (url, datos) => {
    try {
        url = URL_DOMINIO + url
        const response = await axios.post(url, datos)
        return response.data
    } catch (error) {

        return error
    }
}
export default Post
