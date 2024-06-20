import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import Select from 'react-select'
import md5 from 'md5'
function Usuario() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);


    useEffect(() => {

        // ObtenerConfigurables()
    }, [])

    const GuardarUsuario = async (event) => {
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

        <h5><strong>Crer usuario</strong></h5>
        <Row>


            <Col >
                <Form onSubmit={GuardarUsuario}>

                    <Row >



                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Apellidos</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="apellidos"
                                    placeholder="Apellidos de la persona"

                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Nombres</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="nombres"
                                    placeholder="Nombres de la persona"

                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Cedula</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="cedula"
                                    placeholder="Cedula de la persona"

                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Clave</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="contrasena"
                                    placeholder="Clave de la persona"

                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label>
                                <strong>Tipo de usuario</strong>
                            </Form.Label>
                            <InputGroup>
                                <Select
                                    name="tipo"
                                    options={opciones}
                                    placeholder="Selecciona una opción"
                                />
                            </InputGroup>
                        </Col>




                        <Col sm={12} className="my-1">
                            <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Guardar</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

        </Row>


    </>)
}
export default Usuario