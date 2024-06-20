import React, { useState } from 'react';
import MenuArriba from './components/Menu/MenuArriba';
import MenuIzquierdo from './components/Menu/MenuIzquierdo';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const Layout = ({ children }) => {
    const MenuConstante = [
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
        //     nombre: 'Usuario',
        //     link: 'usuario',
        //     hijo: []
        // },
        // {
        //     nombre: 'Tipo de transporte',
        //     link: '',
        //     hijo: [
        //         {
        //             nombre: 'Agregar',
        //             link: 'postTransporte'
        //         },
        //         {
        //             nombre: 'Actualizar',
        //             link: 'putTransporte'
        //         }
        //     ]
        // },
        // {
        //     nombre: 'Tipo de cooperativa',
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
    ]
    const [datos, setDatos] = useState(MenuConstante);
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
            <MenuArriba MenuConstante={MenuConstante}></MenuArriba>
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