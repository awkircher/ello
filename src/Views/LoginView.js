import { useEffect } from 'react'
import { Form } from "../Components/Form"
import logo from '../logo.svg'
import './LoginView.css'

export const LoginView = function(props) {

    const ErrorMessage = () => {
        if (props.error) {
            return <div className="errorMessage">Login failed. Please try again.</div>
        } else {
            return null;
        }
    }

    useEffect(() => {
        let title = `Login | Ello`
        document.title = title;
    },[])

    return (
        <div className="LoginView">
            <img src={logo} alt="Ello logo"></img>
            <ErrorMessage />
            <Form
            checkUserCredentials={props.checkUserCredentials} />
        </div>
    )
}