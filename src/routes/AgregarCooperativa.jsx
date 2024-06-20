import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"

function AgregarCooperativa() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);


    useEffect(() => {

        // ObtenerConfigurables()
    }, [])

    const GuardarCooperativa = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target); // Recolectar datos del formulario



        setCargando(true);

        // Realizar la solicitud POST utilizando axios
        const response = await Post('API/postCooperativa.php', formData);


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


    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Agregar tipo de cooperativa</strong></h5>
        <Form onSubmit={GuardarCooperativa}>
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
                        <strong>Disco</strong>
                    </Form.Label>
                    <InputGroup>
                        <Form.Control name="disco" type="text" required />
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
export default AgregarCooperativa