import { NavLink, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import { Accordion, Card, ListGroup, Table } from 'react-bootstrap';


function MenuIzquierdo({ busqueda }) {

  const navigate = useNavigate()
  const [tipoUsuario, setTipoUsuario] = useState('')

  useEffect(() => {
    const DatosPersona = localStorage.getItem("DatosPersona")
    if (!DatosPersona) {
      navigate('/login')
      return
    }
    const datos = JSON.parse(DatosPersona)
    setTipoUsuario(datos.tipo)

  }, [])



  return (
    <>



      {
        busqueda?.filter(x => x.hijo.length == 0).map((papa, index) => {


          return (

            <Nav.Link key={index} style={{ paddingLeft: 19, marginTop: 15 }} as={NavLink} to={"/" + papa.link}>{papa.nombre}</Nav.Link>
          )


        }
        )
      }



      <Accordion flush style={{ marginTop: 5 }}>

        {
          busqueda?.filter(x => x.hijo.length > 0).map((papa, index) => {


            return (

              <Accordion.Item
                key={index}
                eventKey={index}


              > {/* Cambiado el eventKey a una cadena */}
                <Accordion.Header>{papa.nombre}</Accordion.Header>
                <Accordion.Body>

                  {
                    papa.hijo.map((hijo, recorrido) => {
                      return (


                        <Nav.Link key={recorrido} style={{ paddingLeft: 10, marginBottom: 10 }} as={NavLink} to={"/" + hijo.link}>{hijo.nombre}</Nav.Link>


                      )
                      suma++
                    })
                  }

                </Accordion.Body>
              </Accordion.Item>
            )


          })
        }

      </Accordion>
    </>)
}
export default MenuIzquierdo
