import { useEffect, useState } from "react"
import Cargando from "../components/Cargando"
import Mensaje from "../components/Mensaje"
import { Button, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../services/Post"
import Get from "../services/Get"
import { renderToString } from 'react-dom/server';
import { URL_DOMINIO } from "../../constantes"
import '../estilos/estilos.css'
import Select from 'react-select'
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver'; // Importa file-saver para guardar archivos


function Reportes() {

    const [cargando, setCargando] = useState(false)

    const [totalRecaudado, setTotalRecaudado] = useState(0)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const [tipoTransportes, setTipoTransportes] = useState([]);
    const [cooperativas, setCooperativas] = useState([]);

    const [recaudadores, setRecaudadores] = useState([]);

    const [reporte, setReporte] = useState([]);



    useEffect(() => {


        getAllTiposTransporte()
        getAllRecaudadores()
        //ObtenerRecaudacionesByIdUsuario()
    }, [])





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

    const ObtenerReporte = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);


        // se hace esto sólo si es método get
        const params = {};
        formData.forEach((value, key) => {
            params[key] = value;
        });
        setCargando(true);

        const response = await Get('API/getReporte.php', params);

        setCargando(false);

        if (!response.exito) {
            setMensaje(response.mensaje); // Establecer el mensaje de respuesta
            setMostrarMensaje(true);
        }

        let redaudado = 0.00;
        response.datos.map((item, index) => {


            redaudado += item.monto

        })
        setTotalRecaudado(redaudado)

        setReporte(response.datos)


    }
    const getAllRecaudadores = async () => {

        setCargando(true)

        const resp = await Get('API/getRecaudadores.php')
        setCargando(false)

        if (!resp.exito) {
            setMensaje(resp.mensaje)
            setMostrarMensaje(true)
            return
        }



        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.apellido + " " + item.nombre, // Etiqueta visible en el selector
        }));
        setRecaudadores(options)
    }
    const getAllTiposTransporte = async () => {

        setCargando(true)

        const resp = await Get('API/getAllTransportes.php')
        setCargando(false)

        if (!resp.exito) {
            setMensaje(resp.mensaje)
            setMostrarMensaje(true)
            return
        }



        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.nombre, // Etiqueta visible en el selector
        }));
        setTipoTransportes(options)
    }
    const handleImagenTipoTransporte = async (event) => {






        let id = event.value
        let parametros = { id }
        setCargando(true)

        const resp = await Get('API/getCooperativasByTipo.php', parametros)
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

        /////////////////        



    }
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws_name = "Reporte";
        const ws_data = [
            ["Monto", "Fecha Ingreso", "Apellido", "Nombre", "Tipo Transporte", "Cooperativa", "Disco"],
            ...reporte.map(item => [
                item.monto,
                // item.fechainicio,
                item.fechafin,
                item.apellido,
                item.nombre,
                item.tipotransporte,
                item.cooperativa,
                item.disco
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        const borderStyle = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
        };

        // Aplicar el estilo de borde a todas las celdas dentro del rango
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cell_address]) continue;
                if (!ws[cell_address].s) ws[cell_address].s = {};
                Object.assign(ws[cell_address].s, borderStyle);
            }
        }

        // Agregar la hoja al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        // Guardar el archivo
        const filename = "reporte.xlsx";
        XLSX.writeFile(wb, filename);

    };

    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Reporte general</strong></h5>

        <Row >
            <Col sm={3}>
                <Form onSubmit={ObtenerReporte}>




                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Desde</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="date"
                                required
                                name="desde" />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label  >
                            <strong>Hasta</strong>
                        </Form.Label>
                        <InputGroup>

                            <Form.Control
                                type="date"
                                required
                                name="hasta" />
                        </InputGroup>
                    </Col>

                    <Col className="my-1">
                        <Form.Label>
                            <strong>Persona que recauda</strong>
                        </Form.Label>
                        <InputGroup>
                            <Select
                                className="form-control"
                                name="recaudador"
                                required
                                options={recaudadores}
                                placeholder="Selecciona el recaudador"
                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label>
                            <strong>Tipo de transporte</strong>
                        </Form.Label>
                        <InputGroup>
                            <Select
                                className="form-control"
                                name="tipotransporte"
                                required
                                options={tipoTransportes}
                                placeholder="Selecciona un tipo de transporte"
                                onChange={(e) => { handleImagenTipoTransporte(e) }}
                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label>
                            <strong>Cooperativa</strong>
                        </Form.Label>
                        <InputGroup>
                            <Select
                                className="form-control"
                                name="cooperativa"
                                required
                                options={cooperativas}
                                placeholder="Selecciona una cooperativa"
                            />
                        </InputGroup>
                    </Col>
                    <Col className="my-1">
                        <Form.Label>
                            <strong>Tipo de recaudación</strong>
                        </Form.Label>
                        <InputGroup>
                            <Select
                                className="form-control"
                                name="tiporecaudacion"
                                required
                                options={[{ value: "todos", label: "Todas" }, { value: "normal", label: "Normal" }, { value: "union", label: "Unión" }]}
                                placeholder="Selecciona tipo de reaudacion"
                            />
                        </InputGroup>
                    </Col>



                    <Col className="my-1">
                        <Form.Label>
                            <strong>Buscar</strong>
                        </Form.Label>
                        <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Buscar</Button>
                    </Col>
                    <Col className="my-1">
                        <Form.Label>
                            <strong>Exportar</strong>
                        </Form.Label>
                        <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} onClick={() => { exportToExcel() }} className="form-control" >Exportar</Button>
                    </Col>

                </Form>
            </Col>
            <Col sm={9}  >

                {
                    reporte.length > 0 &&
                    <Col style={{ maxHeight: 500, overflowY: "auto" }}>
                        <Table striped bordered hover >
                            <thead>
                                <tr>
                                    <th >TIPO DE RECAUDACION</th>
                                    <th >COOPERATIVA</th>
                                    <th >RECAUDADOR</th>
                                    <th >F. INGRESO</th>
                                    <th >TOTAL</th>
                                    <th >DISCO</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    reporte.length > 0 && reporte.map((item, index) => {
                                        let apellido = item.apellido
                                        let nombre = item.nombre

                                        let tipotransporte = item.tipotransporte
                                        let cooperativa = item.cooperativa
                                        let recaudador = apellido + " " + nombre
                                        let fechainicio = item.fechainicio
                                        let fechafin = item.fechafin
                                        let monto = item.monto
                                        let disco = item.disco




                                        return (
                                            <tr key={index}>
                                                <td > {tipotransporte}</td>
                                                <td > {cooperativa}</td>
                                                <td > {recaudador}</td>
                                                {/* <td > {fechainicio}</td> */}
                                                <td > {fechafin}</td>
                                                <td > {monto}</td>
                                                <td > {disco}</td>
                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </Table>

                    </Col>



                }
                {
                    reporte.length > 0 && <h4>Recaudado total: {totalRecaudado}</h4>
                }

            </Col>

        </Row>




    </>)
}
export default Reportes