import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';
import Cargando from '../components/Cargando'
import Mensaje from '../components/Mensaje'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Get from '../services/Get';
import md5 from 'md5'
import escudo from '../assets/almacen.png'
function Login() {
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const Logear = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);

        // Retrieve the data using the names of the input fields
        const usuario = formData.get('usuario');
        const contrasena = formData.get('contrasena');
        const clave = md5(contrasena);//md5 de contrasena






        let parametros = {
            usuario,
            clave
        }
        setCargando(true)
        const respu = await Get('API/getLogin.php', parametros)


        setCargando(false)


        if (!respu.exito) {

            setMensaje(respu.mensaje)
            setMostrarMensaje(true)
            return
        }


        let tmpjson = {
            tipo: respu.datos[0].tipo,
            id: respu.datos[0].id,
            nombres: respu.datos[0].nombre,
            apellidos: respu.datos[0].apellido,
            cedula: respu.datos[0].cedula
        }
        const json = JSON.stringify(tmpjson)

        localStorage.setItem("DatosPersona", json)


        let tipo = respu.datos[0].tipo

        if (tipo === "ADM") {

            navigate('/reportes')
        } else if (tipo === "CON") {
            navigate('/reportes')
        } else {
            navigate('/')
        }


        return


    }

    useEffect(() => {

        if (localStorage.getItem("DatosPersona")) {
            const DatosPersona = localStorage.getItem("DatosPersona")
            const infoPersona = JSON.parse(DatosPersona)
            let tipo = infoPersona.tipo


            if (tipo === "ADM") {

                navigate('/reportes')
            } else if (tipo === "CON") {
                navigate('/reportes')
            } else {
                navigate('/')
            }
        }
    }, [])
    return (
        <>
            <div style={{
                backgroundImage: "url('/IMAGENES/IMAGENES/distribucion.jpg')",
                backgroundSize: 'cover', textAlign: 'center',

            }}>
                <div className='container'
                    style={{

                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh'


                    }}
                >
                    <div style={{ maxWidth: 300, border: '1px solid gray', padding: 20, borderRadius: 30, backgroundColor: 'rgba(200, 200, 200, 0.3)' }}>
                        <Form onSubmit={Logear} style={{ textAlign: 'left' }}>
                            {<div>
                                <Image fluid src={escudo} style={{ marginBottom: 10 }}></Image>

                            </div>}

                            <FloatingLabel
                                label="Usuario"
                                className="mb-3"
                            >
                                <Form.Control type="text" name='usuario' required placeholder="Ingrese usuario" />
                            </FloatingLabel>



                            <FloatingLabel
                                label="Clave"
                                className="mb-3"
                            >
                                <Form.Control type="password" name='contrasena' required placeholder="Ingrese contraseña" />
                            </FloatingLabel>

                            <Form.Group className="mb-3">
                                <Button type='submit' style={{ fontSize: 18, backgroundColor: 'black', borderColor: "black" }} className='form-control'>Ingresar</Button>

                            </Form.Group>
                        </Form>


                    </div>

                </div >
            </div>
            <Cargando show={cargando} />
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />


        </>

    );
}

export default Login