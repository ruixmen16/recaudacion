import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import Get from "../services/Get"
import { URL_DOMINIO } from "../../constantes"
import '../estilos/estilos.css'
import Select from 'react-select'



function UnionCooperativa() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        monto: 0.00,
        tipovehiculo: "",
        tipotransporte: "",
        disco: ""

    };
    const [formData, setFormData] = useState(valoresInicialesFormData);
    const [transportes, setTransportes] = useState([]);
    const [cooperativas, setCooperativas] = useState([]);

    const [valorCooperativas, setValorCooperativas] = useState(null);
    const [valorTransporte, setValorTransporte] = useState(0);
    const [recaudaciones, setRecaudaciones] = useState(0);


    useEffect(() => {

        ObtenerTransportes()

        ObtenerRecaudacionesByIdUsuario()
    }, [])

    const handleSelectCooperativa = (evento) => {

        setValorCooperativas(evento)
        const nuevoMonto = parseFloat(evento.precio).toFixed(2); // Convertir y redondear el valor si es necesario

        setFormData(prevFormData => ({
            ...prevFormData,
            monto: nuevoMonto,

        }));

    }


    const ObtenerRecaudacionesByIdUsuario = async () => {

        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)


        // datos.id
        let parametros = {
            id: datos.id,
            fecha: ""

        }
        setCargando(true)
        const resp = await Get('API/getRecaudacionesByIdUsuario.php', parametros)
        setCargando(false)

        if (!resp.exito) {
            setMensaje(resp.mensaje)
            setMostrarMensaje(true)
            return
        }


        setRecaudaciones(resp.datos)


    }
    const ObtenerTransportes = async () => {
        setCargando(true)
        const resp = await Get('API/getTransportesUnionCooperativa.php')
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





        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)


        formData.append('cooperativa', valorCooperativas.label);
        formData.append('idPersona', datos.id);
        formData.set('tipotransporte', valorTransporte);



        setCargando(true);

        // Realizar la solicitud POST utilizando axios
        const response = await Post('API/postRecaudacionUnionCooperativa.php', formData);


        setCargando(false);


        setMensaje(response.mensaje); // Establecer el mensaje de respuesta
        setMostrarMensaje(true);

        setFormData({
            monto: 0.00,
            tipovehiculo: "",
            disco: ""
        });
        ObtenerRecaudacionesByIdUsuario()
    }


    const handleImagenTipoTransporte = async (info) => {




        setValorTransporte(info.id)

        let id = info.id
        let parametros = { id }
        setCargando(true)

        const resp = await Get('API/getCooperativasbyIdTipoTransporte.php', parametros)
        setCargando(false)

        if (!resp.exito) {
            setMensaje(resp.mensaje)
            setMostrarMensaje(true)
            return
        }

        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.nombre, // Etiqueta visible en el selector
            precio: item.precio
        }));

        setCooperativas(options)

        setFormData(prevFormData => ({
            ...prevFormData,
            tipovehiculo: info.nombre,
            tipotransporte: info.id

        }));
        /////////////////        



    }
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Union cooperativa</strong></h5>
        <h6>Total recaudado: {recaudaciones}</h6>

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
                                readOnly
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
                                readOnly
                                name="tipotransporte"
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
                                name="cooperativa"
                                value={valorCooperativas}
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


                                name="disco"
                                placeholder="Disco.."
                                value={formData.disco}
                                onChange={(e) => {
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        disco: e.target.value
                                    }));
                                }}



                            />
                        </InputGroup>
                    </Col>


                    <Col sm={12} className="my-1">
                        <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Registrar</Button>
                    </Col>

                </Form>
            </Col>
            <Col sm={6}>
                {
                    transportes.length &&
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
                                        {/* <div style={{
                                            //position: 'absolute',
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
                                        </div> */}
                                        <span><strong>{item.nombre}</strong></span>
                                    </div>
                                </div>

                            ))
                        }
                    </ul>
                }

            </Col>

        </Row>


    </>)
}
export default UnionCooperativa