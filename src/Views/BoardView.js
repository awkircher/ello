import { useState, useEffect } from "react"
import { useRouteMatch } from "react-router-dom"
import { api } from "../API/api"
import { List } from "../Components/List"
import { Navigation } from "../Components/Navigation"

export const BoardView = function(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [lists, setLists] = useState([])
    const remote = api()
    const match = useRouteMatch();
    
    const initLists = async function(boardId) {
        if (!boardId) {
            return;
        }
        let response = await remote.getListsByBoardId(boardId);
        if (response) {
            setLists(response)
            setIsLoading(false)
        } else {
            console.log('not found')
        }
    };
    
    const listDisplay = lists.map((list) =>
        <div key={list.uid}>
            <List 
                listId={list.uid}
                name={list.name}
            />
        </div>
    );
    
    useEffect(() => {
        initLists(match.params.boardId);
    },[])

    if (isLoading) {
        return (
            <div>Please hold!</div>
        )
    } else {
        return (
            <div>
                <Navigation />
                <h1>{match.params.boardName}</h1>
                {listDisplay}
            </div>
        )
    }
}