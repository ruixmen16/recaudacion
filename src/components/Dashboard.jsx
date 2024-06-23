import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import Get from '../services/Get'; // Asegúrate de importar correctamente tu función para peticiones GET
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Row, Col, Form } from 'react-bootstrap'; // Importa los componentes necesarios de React Bootstrap

// Registra los elementos de Chart.js necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels
);

function Dashboard() {
    const [recaudacionPorHora, setRecaudacionPorHora] = useState([]);

    const [recaudacionTotal, setRecaudacionTotal] = useState(0);
    const [recaudacionPorTipo, setRecaudacionPorTipo] = useState([]);
    const [recaudacionPorCooperativa, setRecaudacionPorCooperativa] = useState([]);
    const [recaudacionPorUsuario, setRecaudacionPorUsuario] = useState([]);
    const today = new Date(); // Obtén la fecha actual como un objeto Date
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes actual


    const [fechaDesde, setFechaDesde] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [fechaHasta, setFechaHasta] = useState(today.toISOString().split('T')[0]);

    useEffect(() => {
        async function fetchData() {
            const params = { desde: fechaDesde, hasta: fechaHasta };

            const recTotal = await Get('APIDASHBOARD/getRecaudacionTotal.php', params);
            setRecaudacionTotal(recTotal.datos);

            const recTipo = await Get('APIDASHBOARD/getRecaudacionPorTipo.php', params);
            setRecaudacionPorTipo(recTipo.datos);

            const recCooperativa = await Get('APIDASHBOARD/getRecaudacionPorCooperativa.php', params);
            setRecaudacionPorCooperativa(recCooperativa.datos);

            const recUsuario = await Get('APIDASHBOARD/getRecaudacionPorUsuario.php', params);
            setRecaudacionPorUsuario(recUsuario.datos);

            const response = await Get('APIDASHBOARD/getRecaudacionPorHora.php', params);
            setRecaudacionPorHora(response.datos);
        }
        fetchData();
    }, [fechaDesde, fechaHasta]);

    const dataRecaudacionbyHora = {
        labels: recaudacionPorHora.map(item => `${item.hora}:00`),
        datasets: [{
            label: 'Recaudación por hora',
            data: recaudacionPorHora.map(item => item.recaudacion),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    const dataFlujoVehicularbyHora = {
        labels: recaudacionPorHora.map(item => `${item.hora}:00`),
        datasets: [{
            label: 'Flujo vehicular por hora',
            data: recaudacionPorHora.map(item => item.numero_vehiculos),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: $ ${value}`;
                    }
                }
            },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, curr) => acc + parseFloat(curr), 0); // Asegurarse de que curr sea un número
                    const percentage = ((value / total) * 100).toFixed(2);
                    //return `$ ${value} /n(${percentage}%)`;
                    return `$${value}\n(${percentage}%)`; // \n para nueva línea


                },
                color: '#fffff',
                anchor: 'end',  // Posición de la etiqueta respecto al punto
                align: 'start',  // Alineación de la etiqueta
                offset: -35,  // Desplazamiento de la etiqueta
            }
        },

    };

    const optionsFlujo = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}:  ${value} vehiculos`;
                    }
                }
            },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, curr) => acc + parseFloat(curr), 0); // Asegurarse de que curr sea un número
                    const percentage = ((value / total) * 100).toFixed(2);
                    //return `$ ${value} /n(${percentage}%)`;
                    return `#${value}\n(${percentage}%)`; // \n para nueva línea


                },
                color: '#fffff',
                anchor: 'end',  // Posición de la etiqueta respecto al punto
                align: 'start',  // Alineación de la etiqueta
                offset: -35,  // Desplazamiento de la etiqueta
            }
        },

    };
    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = parseFloat(context.raw);
                        const total = context.dataset.data.reduce((acc, curr) => acc + parseFloat(curr), 0); // Asegurarse de que curr sea un número

                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: $ ${value} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                formatter: (value, context) => {
                    const label = context.dataset.label || '';
                    const total = context.chart.data.datasets[0].data.reduce((acc, curr) => acc + parseFloat(curr), 0);

                    const percentage = ((value / total) * 100).toFixed(2);
                    return `$ ${value} (${percentage}%)`;

                    //return `${percentage}%`;
                },
                color: '#fffff',
            }
        }
    };
    return (
        <>

            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha Desde:</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}

                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha Hasta:</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>Recaudación Total: ${recaudacionTotal}</h2>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <h2>Recaudación por Tipo de Transporte</h2>
                    <Bar
                        data={{
                            labels: recaudacionPorTipo.map(item => item.nombre),
                            datasets: [{

                                label: 'Recaudado',
                                data: recaudacionPorTipo.map(item => item.recaudacion),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={options}
                    />
                </Col>
                <Col md={6}>
                    <h2>Recaudación por Usuario</h2>
                    <Bar
                        data={{
                            labels: recaudacionPorUsuario.map(item => `${item.nombre} ${item.apellido}`),
                            datasets: [{
                                label: 'Recaudación por Usuario',
                                data: recaudacionPorUsuario.map(item => item.recaudacion),
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={options} />
                </Col>

                <Col md={12} >
                    <h2>Recaudación por hora</h2>
                    <Bar data={dataRecaudacionbyHora} options={options} />
                </Col>

                <Col md={12}>
                    <h2>Flujo vehicular por hora</h2>
                    <Bar data={dataFlujoVehicularbyHora} options={optionsFlujo} />
                </Col>

                <Col sm={12}>
                    <h2>Recaudacion por Cooperativa</h2>
                    <Bar
                        data={{
                            labels: recaudacionPorCooperativa.map(item => item.nombre),
                            datasets: [{
                                label: 'Recaudado',
                                data: recaudacionPorCooperativa.map(item => item.recaudacion),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={options} />
                </Col>
            </Row>





            {/* <Row>
                <Col sm={6}>
                    <h2>Recaudación por Tipo de Transporte</h2>
                    <Pie
                        data={{
                            labels: recaudacionPorTipo.map(item => item.nombre),
                            datasets: [{
                                label: 'Recaudado',
                                data: recaudacionPorTipo.map(item => item.recaudacion),
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        }}
                        options={pieOptions}
                    />
                </Col>

            </Row> */}


        </>
    );
}

export default Dashboard;
