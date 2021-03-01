import './Form.css'

export const Form = function(props) {
    return (
        <div className="Form">
            <h1>Log in to Ello</h1>
            <form onSubmit={(event) => {
                    event.preventDefault();
                    const elem = event.target;
                    const username = elem[0].value;
                    const password = elem[1].value;
                    props.checkUserCredentials(username, password)
                }}>
                <input type="text" placeholder="username"></input>
                <input type="password" placeholder="password"></input>
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}
