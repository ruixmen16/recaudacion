import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import Select from 'react-select'
import md5 from 'md5'
function ActualizarCooperativa() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);


    useEffect(() => {

        // ObtenerConfigurables()
    }, [])

    const ModificarTransporte = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target); // Recolectar datos del formulario
        const contrasena = formData.get('contrasena');
        const clave = md5(contrasena);//md5 de contrasena
        formData.append("clave", clave)
        setCargando(true);

        // Realizar la solicitud POST utilizando axios
        const response = await Post('API/postUsuario.php', formData)

        setCargando(false);
        if (response.exito) {
            setMensaje(response.mensaje)// Establecer el mensaje de respuesta
            setMostrarMensaje(true)
            return
        }

        setMensaje(response.mensaje); // Establecer el mensaje de respuesta
        setMostrarMensaje(true);

        // Si el usuario se creó exitosamente, puedes limpiar el formulario u otras acciones necesarias
        if (response.data.exito) {
            event.target.reset(); // Reiniciar el formulario




        }
    }
    const opciones = [
        { value: 'ADM', label: 'Administrador' },
        { value: 'RED', label: 'Recaudador' }
    ];


    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Actualizar cooperativa</strong></h5>



    </>)
}
export default ActualizarCooperativa