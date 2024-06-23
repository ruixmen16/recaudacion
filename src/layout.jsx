import React, { useEffect, useState } from 'react';
import MenuArriba from './components/Menu/MenuArriba';
import MenuIzquierdo from './components/Menu/MenuIzquierdo';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const Layout = ({ children }) => {
    const [datos, setDatos] = useState();
    const isMobile = useMediaQuery({ maxWidth: 768 });



    useEffect(() => {


        const DatosPersona = localStorage.getItem("DatosPersona")
        const infoPersona = JSON.parse(DatosPersona)
        let tipoUsuario = infoPersona.tipo

        let menuConstante = [];
        if (tipoUsuario === "ADM") {
            menuConstante.push(
                {
                    nombre: 'Dashboard',
                    link: 'dashboard',
                    hijo: []
                },
                {
                    nombre: 'Creacion de usuario',
                    link: 'usuario',
                    hijo: []
                },
                {
                    nombre: 'Reportes',
                    link: 'reportes',
                    hijo: []
                }
            )
        } else if (tipoUsuario === "CON") {
            menuConstante.push(
                {
                    nombre: 'Reportes',
                    link: 'reportes',
                    hijo: []
                })
        } else if (tipoUsuario === "RED") {
            menuConstante.push(
                {
                    nombre: 'Principal',
                    link: '',
                    hijo: []
                },
                {
                    nombre: 'Union cooperativa',
                    link: 'unioncooperativa',
                    hijo: []
                }

            )
        }
        setDatos(menuConstante)
    }, [])

    return (
        <>
            <MenuArriba busqueda={datos}></MenuArriba>
            <Container fluid>
                <Row >
                    {/* Sidebar */}
                    {
                        !isMobile && <Col sm={2} style={{ height: `calc(100vh - 60px)`, padding: 0 }}>


                            <MenuIzquierdo busqueda={datos} ></MenuIzquierdo>

                        </Col>
                    }

                    {/* height: `calc(100vh - 60px)` */}
                    {/* Main content area */}
                    <Col style={{ backgroundColor: 'lightgray' }} >
                        <Container fluid style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 8, padding: 10, height: 'calc(100vh - 80px)', overflowY: 'auto', overflowX: 'hidden' }}>

                            {children}
                        </Container>

                    </Col>
                </Row>
            </Container >

        </>
    );
};

export default Layout;