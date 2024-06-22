import { NavLink, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useMediaQuery } from 'react-responsive';
import { NavDropdown, Navbar } from 'react-bootstrap';

function MenuTelefono({ busqueda }) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate()
    const [tipoUsuario, setTipoUsuario] = useState('')
    const [nombrePersona, setNombrePersona] = useState('')
    const cerrarSesion = () => {
        localStorage.clear()
        navigate('/login')
    }


    useEffect(() => {

        const DatosPersona = localStorage.getItem("DatosPersona")
        if (!DatosPersona) {
            navigate('/login')
            return
        }
        const datos = JSON.parse(DatosPersona)
        setNombrePersona(datos.apellidos + " " + datos.nombres)

        setTipoUsuario(datos.tipo)


        const infoPersona = JSON.parse(DatosPersona)
        let tipo = infoPersona.tipo


        if (tipo === "ADM") {

            navigate('/reportes')
        } else if (tipo === "CON") {
            navigate('/reportes')
        } else {
            navigate('/')
        }





    }, [])


    return (<>


        <Navbar style={{ backgroundColor: '#1A1B1C', height: '60px' }} expand='lg' data-bs-theme="dark"   >
            <Container fluid>{ /*fluid*/}
                <Navbar.Brand href="/" style={{ fontSize: 14 }}>
                    {/* <img
            alt="imagen logo sistema"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          /> */}
                    {nombrePersona}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='offcanvasNavbar-expand-false' />
                <Navbar.Offcanvas style={{ width: '70vw' }} id='offcanvasNavbar-expand-false'
                    aria-labelledby='offcanvasNavbarLabel-expand-false'
                    placement='end'
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id='offcanvasNavbarLabel-expand-false'>
                            Menú
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body >
                        <Nav className="justify-content-end flex-grow-1 pe-3" >
                            {
                                (isMobile && busqueda.length > 0) && busqueda.filter(x => x.hijo.length != 0).map((papa, index) => {

                                    return (
                                        <NavDropdown key={index} title={papa.nombre} >
                                            {
                                                papa.hijo.map((hijo, recorrido) => {
                                                    return (
                                                        <NavDropdown.Item key={recorrido} as={NavLink} to={"/" + hijo.link}>
                                                            {hijo.nombre}
                                                        </NavDropdown.Item>
                                                    )
                                                })
                                            }
                                        </NavDropdown>
                                    )
                                }
                                )
                            }
                            {
                                (isMobile && busqueda.length > 0) && busqueda.filter(x => x.hijo.length == 0).map((papa, index) => {
                                    return (
                                        <Nav.Link key={index} as={NavLink} to={"/" + papa.link}>{papa.nombre}</Nav.Link>
                                    )
                                }
                                )
                            }

                            <Nav.Link to="/" onClick={() => cerrarSesion()} >Cerrar Sesión</Nav.Link>

                        </Nav>

                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar >





    </>)
}
export default MenuTelefono
