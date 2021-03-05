import { UserContext } from "../Models/UserContext"
import { Navigation } from "../Components/Navigation";
import { api } from "../API/api"
import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom";
import recent from "../icons/recent-icon-dark.svg"
import member from "../icons/member-icon-dark.svg"
import "./DashboardView.css"
import "./BackgroundSettings.css"

export const DashboardView = function() {
    const [isLoading, setIsLoading] = useState(true)
    const user = useContext(UserContext)
    const remote = api()
    const [ownedBoards, setOwnedBoards] = useState([])
    const [sharedBoards, setSharedBoards] = useState([])
    
    const initBoards = async function(user) {
        console.log('initBoards called with ', user)
        if (!user) {
            return;
        }
        let response = await remote.getBoardsByUserId(user.currentUser.uid);
        if (response) {
            setOwnedBoards(response.filter((board) => board.ownerId === user.currentUser.uid))
            setSharedBoards(response.filter((board) => board.ownerId !== user.currentUser.uid))
            setIsLoading(false)
        } else {
            console.log('not found')
        }
    };
    
    const ownedBoardsLinks = ownedBoards.map((board) =>
        <Link className={`boardTile ${board.background}`} key={`owned${board.uid}`} to={`/${board.uid}/${board.name}`}>
            <div>{board.name}</div>
        </Link>
    );
    const sharedBoardsLinks = sharedBoards.map((board) => 
        <Link className={`boardTile ${board.background}`} key={`shared${board.uid}`} to={`/${board.uid}/${board.name}`}>
            <div>{board.name}</div>
        </Link>
    );
    
    useEffect(() => {
        initBoards(user);
        let title = `Boards | Ello`
        document.title = title;
    },[])
    
    if (isLoading) {
        return (
            <div>
                <Navigation />
            </div>
        )
    } else {
        return (
            <div className="Dashboard">
                <Navigation />
                <div className="boardTiles">
                    <div className="sectionTitle">
                        <img src={recent} alt="recently viewed icon"></img>
                        <h1>Your Boards</h1>
                    </div>
                    <section className="recents">
                        {ownedBoardsLinks}
                    </section>
                    <div className="sectionTitle">
                        <img src={member} alt="member icon"></img>
                        <h1>Shared Boards</h1>
                    </div>
                    <section className="all">
                        {sharedBoardsLinks}
                    </section>
                </div>
            </div>
        )
    }
}