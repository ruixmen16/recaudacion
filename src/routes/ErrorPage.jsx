import { Button, Image } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import error404 from '../assets/error404.jpg'
export default function ErrorPage() {

    const navigate = useNavigate()
    return (
        <div className="container" >
            <div className="row" >
                <div className="col-12 col-lg-6" style={{ textAlign: "center" }}> <Image fluid src={error404}></Image></div>
                <div className="col-12 col-lg-6"> <h1>Oops!</h1>
                    <p>Lo siento, has accedido a una página que no existe.</p>
                    <Button className="form-control" onClick={() => navigate('/login')}>Dirigir página principal</Button>


                </div>
            </div>
        </div>
    );
}