import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
function Configurables() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        id: '',
        iva: '',
        propietario: '',
        nombre_empresa: '',
        direccion_matriz: '',
        ruc: '',



    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    useEffect(() => {

        //ObtenerConfigurables()
    }, [])
    const ObtenerConfigurables = async () => {
        setCargando(true)
        const resp = await Post('API/obtener_configurables.php')
        setCargando(false)


        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }

        try {
            for (const key in resp[0]) {
                const value = resp[0][key];
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [key]: value
                }));

            }
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }
    const GuardarConfigurables = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);

        setCargando(true)
        const resp = await Post('API/actualizar_configurables.php', formData)
        setCargando(false)
        console.log(resp)
        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se actualizó correctamente') {

            setFormData(valoresInicialesFormData)
            await ObtenerConfigurables()

        }


    }



    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Configurables</strong></h5>
        <Row>


            <Col >
                <Form onSubmit={GuardarConfigurables}>
                    <InputGroup>

                        <Form.Control
                            type="text"
                            required
                            name="id"
                            hidden
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}

                        />
                    </InputGroup>
                    <Row >



                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Iva</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    step={0.01}
                                    required
                                    name="iva"
                                    placeholder="Valor del iva"
                                    value={formData.iva}
                                    onChange={(e) => setFormData({ ...formData, iva: e.target.value })}

                                />
                            </InputGroup>
                        </Col>

                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Propietario</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="propietario"
                                    value={formData.propietario}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                propietario: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Nombre empresa</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="nombre_empresa"
                                    value={formData.nombre_empresa}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                nombre_empresa: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Dirección matriz</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="direccion_matriz"
                                    value={formData.direccion_matriz}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                direccion_matriz: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>





                        <Col sm={6} className="my-1">
                            <Form.Label  >
                                <strong>Ruc</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="ruc"
                                    value={formData.ruc}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                ruc: e.target.value
                                            })}
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
export default Configurables