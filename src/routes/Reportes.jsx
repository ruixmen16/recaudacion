import { useEffect, useState } from "react";
import Cargando from "../components/Cargando";
import Mensaje from "../components/Mensaje";
import { Accordion, Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import Get from "../services/Get";
import '../estilos/estilos.css';
import Select from 'react-select';
import * as XLSX from 'xlsx';

function Reportes() {
    const [cargando, setCargando] = useState(false);
    const [totalRecaudado, setTotalRecaudado] = useState(0);
    const [mensaje, setMensaje] = useState('');
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [tipoTransportes, setTipoTransportes] = useState([]);
    const [cooperativas, setCooperativas] = useState([]);
    const [recaudadores, setRecaudadores] = useState([]);
    const [reporte, setReporte] = useState([]);
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
    const [groupedByTransportType, setGroupedByTransportType] = useState([]);
    const [groupedByCooperative, setGroupedByCooperative] = useState([]);
    const [groupedBySeparacion, setGroupedBySeparacion] = useState([]);
    useEffect(() => {
        getAllTiposTransporte();
        getAllRecaudadores();
    }, []);


    const groupByTransportType = (data) => {
        return data.reduce((acc, item) => {
            const { tipotransporte, monto } = item;
            if (!acc[tipotransporte]) {
                acc[tipotransporte] = { tipotransporte, monto: 0 };
            }
            acc[tipotransporte].monto += monto;
            return acc;
        }, {});
    };

    const groupByCooperative = (data) => {
        return data.reduce((acc, item) => {
            const { cooperativa, monto } = item;
            if (!acc[cooperativa]) {
                acc[cooperativa] = { cooperativa, monto: 0 };
            }
            acc[cooperativa].monto += monto;
            return acc;
        }, {});
    };
    const groupBySeparacion = (data) => {
        return data.reduce((acc, item) => {
            const { cooperativa, monto, tipotransporte } = item;

            if (tipotransporte === "Unión de cooperativa") {
                if (!acc["Unión de cooperativa"]) {
                    acc["Unión de cooperativa"] = { cooperativa: "Unión de cooperativa", monto: 0 };
                }
                acc["Unión de cooperativa"].monto += monto;
            } else {
                if (!acc["Otros"]) {
                    acc["Otros"] = { cooperativa: "Otros", monto: 0 };
                }
                acc["Otros"].monto += monto;
            }
            return acc;
        }, {});
    };
    const ObtenerReporte = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);
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

        let array = response.datos
        const transportTypeData = Object.values(groupByTransportType(array));
        const cooperativeData = Object.values(groupByCooperative(array));
        const separacionData = Object.values(groupBySeparacion(array));
        setGroupedByTransportType(transportTypeData);
        setGroupedByCooperative(cooperativeData);
        setGroupedBySeparacion(separacionData);
        let redaudado = 0.00;
        response.datos.forEach((item) => {
            redaudado += item.monto;
        });
        setTotalRecaudado(redaudado);
        setReporte(response.datos);
    };

    const getAllRecaudadores = async () => {
        setCargando(true);
        const resp = await Get('API/getRecaudadores.php');
        setCargando(false);

        if (!resp.exito) {
            setMensaje(resp.mensaje);
            setMostrarMensaje(true);
            return;
        }

        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.apellido + " " + item.nombre, // Etiqueta visible en el selector
        }));
        setRecaudadores(options);
    };

    const getAllTiposTransporte = async () => {
        setCargando(true);
        const resp = await Get('API/getAllTransportes.php');
        setCargando(false);

        if (!resp.exito) {
            setMensaje(resp.mensaje);
            setMostrarMensaje(true);
            return;
        }

        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.nombre, // Etiqueta visible en el selector
        }));
        setTipoTransportes(options);
    };

    const handleImagenTipoTransporte = async (event) => {
        let id = event.value;
        let parametros = { id };
        setCargando(true);
        const resp = await Get('API/getCooperativasByTipo.php', parametros);
        setCargando(false);

        if (!resp.exito) {
            setMensaje(resp.mensaje);
            setMostrarMensaje(true);
            return;
        }

        const options = resp.datos.map(item => ({
            value: item.id, // Valor que se enviará al seleccionar la opción
            label: item.nombre, // Etiqueta visible en el selector
            precio: item.precio
        }));
        setCooperativas(options);
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws_name = "Reporte";
        const ws_data = [
            ["Monto", "Fecha Ingreso", "Apellido", "Nombre", "Tipo Transporte", "Cooperativa", "Disco"],
            ...reporte.map(item => [
                item.monto,
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

        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cell_address]) continue;
                if (!ws[cell_address].s) ws[cell_address].s = {};
                Object.assign(ws[cell_address].s, borderStyle);
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        const filename = "reporte.xlsx";
        XLSX.writeFile(wb, filename);
    };

    return (
        <>
            <Cargando show={cargando} />
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <h5><strong>Reporte general</strong></h5>

            <Row>
                <Col sm={4} >

                    <Form onSubmit={ObtenerReporte}>
                        <Row>
                            <Col sm={6} className="my-1">
                                <Form.Label><strong>Desde</strong></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="date"
                                        required
                                        defaultValue={today}
                                        name="desde"
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={6} className="my-1">
                                <Form.Label><strong>Hasta</strong></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="date"
                                        defaultValue={today}
                                        required
                                        name="hasta"
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={12} className="my-1">
                                <Form.Label><strong>Persona que recauda</strong></Form.Label>
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
                            <Col sm={12} className="my-1">
                                <Form.Label><strong>Tipo de transporte</strong></Form.Label>
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
                            <Col sm={12} className="my-1">
                                <Form.Label><strong>Cooperativa</strong></Form.Label>
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
                            <Col sm={12} className="my-1">
                                <Form.Label><strong>Tipo de recaudación</strong></Form.Label>
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
                                <Form.Label><strong>Buscar</strong></Form.Label>
                                <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Buscar</Button>
                            </Col>
                            {
                                reporte.length > 0 &&
                                <Col className="my-1">
                                    <Form.Label><strong>Exportar</strong></Form.Label>
                                    <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} onClick={exportToExcel} className="form-control">Exportar</Button>
                                </Col>
                            }
                        </Row>

                    </Form>

                </Col>
                <Col sm={8}>
                    {
                        reporte.length > 0 && <h4>Recaudado total: $ {totalRecaudado}</h4>
                    }
                    {
                        reporte.length > 0 &&

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Reporte separado</Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Tipo</th>
                                                <th>Monto Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedBySeparacion.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.cooperativa}</td>
                                                    <td style={{ textAlign: "right" }}>${item.monto}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Reporte por tipo de transporte</Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Tipo de Transporte</th>
                                                <th>Monto Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedByTransportType.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.tipotransporte}</td>
                                                    <td style={{ textAlign: "right" }}>${item.monto}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Reporte por tipo de cooperativa</Accordion.Header>
                                <Accordion.Body style={{ maxHeight: 350, overflowY: "auto" }}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Cooperativa</th>
                                                <th>Monto Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedByCooperative.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.cooperativa}</td>
                                                    <td style={{ textAlign: "right" }}>${item.monto}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Reporte general</Accordion.Header>
                                <Accordion.Body eventKey="1" style={{ maxHeight: 350, overflowY: "auto" }}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>T. RECAUDACION</th>
                                                <th>COOPERATIVA</th>
                                                <th>RECAUDADOR</th>
                                                <th>F. INGRESO</th>
                                                <th style={{ textAlign: "right" }}>TOTAL</th>
                                                <th>DISCO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                reporte.map((item, index) => {
                                                    let recaudador = `${item.apellido} ${item.nombre}`;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.tipotransporte}</td>
                                                            <td>{item.cooperativa}</td>
                                                            <td >{recaudador}</td>
                                                            <td>{item.fechafin}</td>
                                                            <td style={{ textAlign: "right" }}>${item.monto}</td>
                                                            <td>{item.disco}</td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </Table>

                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>


                    }

                </Col>
            </Row>
        </>
    );
}

export default Reportes;
