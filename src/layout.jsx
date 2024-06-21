import React, { useEffect, useState } from 'react';
import MenuArriba from './components/Menu/MenuArriba';
import MenuIzquierdo from './components/Menu/MenuIzquierdo';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const Layout = ({ children }) => {

    useEffect(() => {
        let MenuConstante = [

        ]

        const DatosPersona = localStorage.getItem("DatosPersona")
        const infoPersona = JSON.parse(DatosPersona)
        let tipoUsuario = infoPersona.tipo

        if (tipoUsuario === "ADM") {
            MenuConstante.push(
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
                // {
                //     nombre: 'Reportes',
                //     link: '',
                //     hijo: [
                //         {
                //             nombre: 'Agregar',
                //             link: 'postCooperativa'
                //         },
                //         {
                //             nombre: 'Actualizar',
                //             link: 'putCooperativa'
                //         }
                //     ]
                // }
            )
        } else {
            MenuConstante.push(
                {
                    nombre: 'Principal',
                    link: '',
                    hijo: []
                },
                {
                    nombre: 'Union cooperativa',
                    link: 'unioncooperativa',
                    hijo: []
                },
                // {
                //     nombre: 'Reporte fin de turno',
                //     link: 'finturno',
                //     hijo: []
                // },

            )
        }
        setDatos(MenuConstante)
    }, [])
    const [datos, setDatos] = useState();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const handleInputChange = (event) => {


        let letra = quitartildes(event.target.value)

        setDatos(MenuConstante.filter((persona) =>
            quitartildes(persona.nombre).includes(letra) ||
            (persona.hijo && persona.hijo.some((hijo) => quitartildes(hijo.nombre).includes(letra)))
        ))
    };

    function quitartildes(letra) {

        letra = letra.toLowerCase()

        return letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return (
        <>
            <MenuArriba MenuConstante={datos}></MenuArriba>
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