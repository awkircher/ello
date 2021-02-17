import { Form } from "../Components/Form"

export const LoginView = function(props) {
    return (
        <div>
            <h1>Login</h1>
            <Form
            checkUserCredentials={props.checkUserCredentials} />
        </div>
    )
}