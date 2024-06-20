import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import PostFile from "../services/PostFile"

import Select from 'react-select'
import md5 from 'md5'
function AgregarTransporte() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);


    useEffect(() => {

        // ObtenerConfigurables()
    }, [])

    const GuardarTransporte = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target); // Recolectar datos del formulario


        formData.append('archivo', imagen);

        setCargando(true);

        // Realizar la solicitud POST utilizando axios
        const response = await PostFile('API/postTransporte.php', formData);


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

    const [imagen, setImagen] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImagen(file);
    };
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Configurables</strong></h5>
        <Form onSubmit={GuardarTransporte}>
            <Row>
                <Col sm={6} className="my-1">
                    <Form.Label>
                        <strong>Nombre</strong>
                    </Form.Label>
                    <InputGroup>
                        <Form.Control name="nombre" type="text" required />
                    </InputGroup>
                </Col>
                <Col sm={6} className="my-1">
                    <Form.Label>
                        <strong>Imagen</strong>
                    </Form.Label>
                    <InputGroup>
                        <Form.Control type="file" onChange={handleFileChange} required />
                    </InputGroup>
                </Col>
                <Col sm={6} className="my-1">
                    <Form.Label>
                        <strong>Precio</strong>
                    </Form.Label>
                    <InputGroup>
                        <Form.Control name="precio" type="number" step={0.01} required />
                    </InputGroup>
                </Col>
                <Col sm={12} className="my-1">
                    <Button style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }} className="form-control" type="submit">
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Form>


    </>)
}
export default AgregarTransporte