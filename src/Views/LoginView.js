import { useEffect } from 'react'
import { Form } from "../Components/Form"
import logo from '../logo.svg'
import './LoginView.css'

export const LoginView = function(props) {

    useEffect(() => {
        let title = `Login | Ello`
        document.title = title;
    },[])

    return (
        <div>
            <img src={logo} alt="Ello logo"></img>
            <Form
            checkUserCredentials={props.checkUserCredentials} />
        </div>
    )
}