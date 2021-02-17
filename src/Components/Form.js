export const Form = function(props) {
    return (
        <div>
            <form onSubmit={(event) => {
                    event.preventDefault();
                    const elem = event.target;
                    const username = elem[0].value;
                    const password = elem[1].value;
                    props.checkUserCredentials(username, password)
                }}>
                <input type="text" placeholder="username"></input>
                <input type="text" placeholder="password"></input>
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}
