import { UserContext } from "../Models/UserContext"
import { BoardView } from "./BoardView";
import { api } from "../API/api"
import { useContext, useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route
  } from "react-router-dom";

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
        let response = await remote.getBoardsByUserId(user.uid);
        if (response) {
            setOwnedBoards(response.filter((board) => board.ownerId === user.uid))
            setSharedBoards(response.filter((board) => board.ownerId !== user.uid))
            setIsLoading(false)
        } else {
            console.log('not found')
        }
    };
    
    const ownedBoardsLinks = ownedBoards.map((board) =>
    <div key={`owned${board.uid}`}>
            <Link to={`/board/${board.uid}`}>{board.name}</Link>
        </div>
    );
    const sharedBoardsLinks = sharedBoards.map((board) => 
    <div key={`shared${board.uid}`}>
            <Link to={`/board/${board.uid}`}>{board.name}</Link>
        </div>
    );
    
    useEffect(() => {
        initBoards(user);
    },[])
    
    if (isLoading) {
        return (
            <div>please hold!</div>
        )
    } else {
        return (
            <div>
                <h1>Hi {user.username}!</h1>
                <Router>
                    <Switch>
                        <Route exact path="/dashboard">
                            <h2>Your Boards</h2>
                            {ownedBoardsLinks}
                            <h2>Shared Boards</h2>
                            {sharedBoardsLinks}
                        </Route>
                        <Route exact path="/board/:boardId" component={BoardView}></Route>
                    </Switch>
                </ Router>
            </div>
        )
    }
}