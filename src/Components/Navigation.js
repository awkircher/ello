import { Link, useRouteMatch } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../Models/UserContext'
import './Navigation.css'

export const Navigation = function(props) {
    const user = useContext(UserContext)
    const match = useRouteMatch();
    const isDashboard = match.url.includes('/boards')

    return (
        <nav className={isDashboard ? 'dash' : 'board'}>
            <Link className="buttonContainer" to={`/${user.currentUser.username}/boards`}>
                <button className="main">&#8962;</button>
            </Link>
            <Link to="/">LOGO</Link>
            <Link to="/login">
                <button className="nested" onClick={() => {user.setLogOut(user.isLoggedIn);}}>
                    Log out
                </button>
            </Link>
        </nav>
    )
}