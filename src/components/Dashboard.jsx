import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Get from '../services/Get'; // Asegúrate de importar correctamente tu función para peticiones GET
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Row, Col, Form } from 'react-bootstrap'; // Importa los componentes necesarios de React Bootstrap

// Registra los elementos de Chart.js necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [recaudacionTotal, setRecaudacionTotal] = useState(0);
    const [recaudacionPorTipo, setRecaudacionPorTipo] = useState([]);
    const [recaudacionPorCooperativa, setRecaudacionPorCooperativa] = useState([]);
    const [recaudacionPorUsuario, setRecaudacionPorUsuario] = useState([]);
    const [fechaDesde, setFechaDesde] = useState('01/01/2023');
    const [fechaHasta, setFechaHasta] = useState('31/12/2024');

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
        }
        fetchData();
    }, [fechaDesde, fechaHasta]);

    return (
        <div>

            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha Desde:</Form.Label>
                        <Form.Control
                            type="text"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            placeholder="DD/MM/YYYY"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha Hasta:</Form.Label>
                        <Form.Control
                            type="text"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            placeholder="DD/MM/YYYY"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>Recaudación Total: {recaudacionTotal}</h2>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>Recaudación por Tipo de Vehículo</h2>
                    <Bar
                        data={{
                            labels: recaudacionPorTipo.map(item => item.nombre),
                            datasets: [{
                                label: 'Recaudación por Tipo de Vehículo',
                                data: recaudacionPorTipo.map(item => item.recaudacion),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Col>
                <Col>
                    <h2>Recaudación por Cooperativa</h2>
                    <Bar
                        data={{
                            labels: recaudacionPorCooperativa.map(item => item.nombre),
                            datasets: [{
                                label: 'Recaudación por Cooperativa',
                                data: recaudacionPorCooperativa.map(item => item.recaudacion),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={{ scales: { y: { beginAtZero: true } } }}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
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
                        options={{ scales: { y: { beginAtZero: true } } }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
