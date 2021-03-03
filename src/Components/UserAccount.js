import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserAccount.css'

export const UserAccount = function(props) {
    const email = props.user.currentUser.email;
    const firstInitial = email.slice(0,1);
    const [isOpen, setIsOpen] = useState(false);
    
    const openMenu = function() {
        setIsOpen(true)
    }

    const closeMenu = function() {
        setIsOpen(false)
    }

    const name = isOpen ? "open":"closed"

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', closeMenu)
        }
        return function cleanUp() {
            window.removeEventListener('click', closeMenu)
        }
    })

    return (
        <div className="UserAccount">
            <div className="userIcon" onClick={openMenu}>
                {firstInitial.toUpperCase()}
            </div>
            <div className={`menu ${name}`}>
                <Link to="/login" onClick={() => {props.user.setLogOut(props.user.isLoggedIn);}}>
                    <div className="menuItem">
                        Log out
                    </div>
                </Link>
            </div>
        </div>
    )
}