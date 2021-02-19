import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../Models/UserContext'

export const Navigation = function(props) {
    const user = useContext(UserContext)
    return (
        <nav>
          <ul>
            <li>
              <Link to="/">LOGO</Link>
            </li>
            <li>
                <Link to={`/${user.currentUser.username}/boards`}>HOME ICON</Link>
            </li>
            <li>
                <Link to="/login">
                    <button onClick={() => {user.setLogOut(user.isLoggedIn);}}>
                        Log out
                    </button>
                </Link>
            </li>
          </ul>
        </nav>
    )
}