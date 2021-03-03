import { Link, useRouteMatch } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../Models/UserContext'
import { UserAccount } from './UserAccount'
import './Navigation.css'
import logo from '../icons/logo-white.svg'
import home from '../icons/home-icon.svg'

export const Navigation = function(props) {
    const user = useContext(UserContext)
    const match = useRouteMatch();
    const isDashboard = match.url.includes('/boards')
    //The data attribute in navigation ensures that click-to-close will
    //work for an opened card.
    return (
        <nav className={isDashboard ? 'dash' : 'board'} data-action="closeCard">
            <Link className="buttonContainer" to={`/${user.currentUser.username}/boards`}>
                <button className="main">
                    <img src={home} alt="home icon"></img>
                </button>
            </Link>
            <Link className="logoContainer" to="/">
                <img src={logo} alt="logo"></img>
            </Link>
            <UserAccount user={user} />
        </nav>
    )
}