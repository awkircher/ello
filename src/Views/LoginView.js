import { Form } from "../Components/Form"
import logo from '../logo.svg'
import './LoginView.css'

export const LoginView = function(props) {
    return (
        <div>
            <img src={logo} alt="Ello logo"></img>
            <Form
            checkUserCredentials={props.checkUserCredentials} />
        </div>
    )
}