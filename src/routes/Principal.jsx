import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import Get from "../services/Get"
import { URL_DOMINIO } from "../../constantes"
import '../estilos/estilos.css'
import Select from 'react-select'



function Principal() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        monto: 0.00,
        tipovehiculo: "",
        disco: ""



    };
    const [formData, setFormData] = useState(valoresInicialesFormData);
    const [transportes, setTransportes] = useState([]);
    const [cooperativas, setCooperativas] = useState([

        {
            value: "Disco 101",
            label: "Reina del camino"
        }
    ]);


    useEffect(() => {

        ObtenerTransportes()
    }, [])

    const handleSelectCooperativa = (evento) => {

        setFormData({ ...formData, disco: evento.value })
    }
    const ObtenerTransportes = async () => {
        setCargando(true)
        const resp = await Get('API/getTransportes.php')
        setCargando(false)

        if (!resp.exito) {
            setMensaje(resp.mensaje)
            setMostrarMensaje(true)
            return
        }

        setTransportes(resp.datos)


    }
    const GuardarConfigurables = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);


    }


    const handleImagenTipoTransporte = (info) => {


        setFormData({
            ...formData,
            monto: info.precio,
            tipovehiculo: info.nombre
        });
    }
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Registro de garita - Terminal Terrestre de Portoviejo</strong></h5>
        <Row>


            <Col sm={6}>
                <Form onSubmit={GuardarConfigurables}>




                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Monto</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="number"
                                step={0.01}
                                required
                                disabled
                                name="monto"
                                value={formData.monto}

                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Tipo de vehiculo</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="text"
                                required
                                disabled
                                name="tipovehiculo"
                                placeholder="Tipo de vehiculo.."
                                value={formData.tipovehiculo}

                            />
                        </InputGroup>
                    </Col>

                    <Col className="my-1">
                        <Form.Label>
                            <strong>Tipo de cooperativa</strong>
                        </Form.Label>
                        <InputGroup>
                            <Select
                                className="form-control"
                                name="tipo"
                                options={cooperativas}
                                placeholder="Selecciona una opción"
                                onChange={(e) => { handleSelectCooperativa(e) }}
                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Disco</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="text"
                                required
                                disabled
                                name="disco"
                                placeholder="Disco.."
                                value={formData.disco}


                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Placa</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="text"
                                required

                                name="placa"
                                placeholder="Placa.."


                            />
                        </InputGroup>
                    </Col>

                    <Col sm={12} className="my-1">
                        <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Registrar</Button>
                    </Col>

                </Form>
            </Col>
            <Col sm={6}>
                <ul className='movies' >
                    {
                        transportes.map((item, index) => (

                            <div key={index} className='movie-poster' >


                                <div style={{ position: 'relative', maxHeight: 200, cursor: 'pointer' }}>
                                    <div
                                        onClick={() => handleImagenTipoTransporte(item)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            maxHeight: 150
                                        }}>
                                        <Image
                                            fluid
                                            style={{
                                                width: '100%',
                                                objectFit: 'contain'
                                            }}
                                            rounded
                                            src={URL_DOMINIO + item.rutaimagen}
                                        />
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        marginTop: 10,
                                        backgroundColor: 'yellow',
                                        color: 'black',
                                        padding: '5px',
                                        borderRadius: '5px',
                                        fontWeight: 'bold'
                                    }}>
                                        $ {(item.precio).toFixed(2)}
                                    </div>
                                    <span><strong>{item.nombre}</strong></span>
                                </div>
                            </div>

                        ))
                    }
                </ul>
            </Col>

        </Row>


    </>)
}
export default Principal