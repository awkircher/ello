import { UserContext } from "../Models/UserContext"
import { BoardView } from "./BoardView";
import { api } from "../API/api"
import { useContext, useState } from "react"
import { useEffect } from "react"
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route
  } from "react-router-dom";

export const DashboardView = function() {
    const user = useContext(UserContext)
    const username = user.username;
    const userId = user.uid;
    const remote = api()

    // An array of board uid's from the user object. 
    // Empty if user hasn't been added to context yet.
    const [boards, setBoards] = useState([])
    
    const initBoards = async function(boards) {
        if (boards.length === 0) {
            return;
        }
        let response = await remote.getBoardsByUserId(userId);
        if (response) {
            setBoards(response)
        } else {
            console.log('not found')
        }
    };

    useEffect(() => {
        initBoards(userId);
    },[])

    const ownedBoards = boards.filter((board) => board.ownerId === userId)
    const sharedBoards = boards.filter((board) => board.ownerId !== userId)

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

    console.log(boards)
    // add the conditional loading stuff here -- so either return what's written
    // now, OR if no data then return some other thing
    return (
        <div>
            <h1>Hi {username}!</h1>
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