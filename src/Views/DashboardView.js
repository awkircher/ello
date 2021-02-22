import { UserContext } from "../Models/UserContext"
import { Navigation } from "../Components/Navigation";
import { api } from "../API/api"
import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom";
import "./DashboardView.css"

export const DashboardView = function() {
    const [isLoading, setIsLoading] = useState(true)
    const user = useContext(UserContext)
    const remote = api()
    const [ownedBoards, setOwnedBoards] = useState([])
    const [sharedBoards, setSharedBoards] = useState([])
    
    const initBoards = async function(user) {
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
        <Link className="boardTile" key={`owned${board.uid}`} to={`/${board.uid}/${board.name}`}>
            <div>{board.name}</div>
        </Link>
    );
    const sharedBoardsLinks = sharedBoards.map((board) => 
        <Link className="boardTile" key={`shared${board.uid}`} to={`/${board.uid}/${board.name}`}>
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
            <div>please hold!</div>
        )
    } else {
        return (
            <div className="Dashboard">
                <Navigation />
                <div className="boardTiles">
                    <h1>Your Boards</h1>
                    <section className="recents">
                        {ownedBoardsLinks}
                    </section>
                    <h1>Shared Boards</h1>
                    <section className="all">
                        {sharedBoardsLinks}
                    </section>
                </div>
            </div>
        )
    }
}