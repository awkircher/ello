import { Form } from "../Components/Form"

export const LoginView = function(props) {
    return (
        <div>
            <h1>Login</h1>
            <Form
            verifyUser={props.verifyUser} />
        </div>
    )
}