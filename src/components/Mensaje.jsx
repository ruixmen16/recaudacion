import { Button, Modal } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

const Mensaje = ({ tipo, mensaje, show, setShow }) => {
    return (
        <>

            <Modal
                centered
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje de información</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ justifyContent: 'center' }}>
                        {mensaje}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => { setShow(false) }}>
                        Entiendo
                    </Button>

                </Modal.Footer>
            </Modal>

        </>
    )
}
export default Mensaje
