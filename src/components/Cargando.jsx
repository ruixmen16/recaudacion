import Modal from 'react-bootstrap/Modal'
import cargandogif from '../assets/loading.gif'
import "./styles/cargando.css"
function Cargando(props) {
    return (
        <Modal
            {...props}
            size="sm"
            centered
            contentClassName="custom-modal-content"

        >
            <Modal.Body className="custom-modal-body">

                {<img src={cargandogif} height={70} alt="" />}

            </Modal.Body>



        </Modal >
    );
}

export default Cargando