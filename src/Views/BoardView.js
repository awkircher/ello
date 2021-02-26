import { useState, useEffect } from "react"
import { useRouteMatch } from "react-router-dom"
import { api } from "../API/api"
import { List } from "../Components/List"
import { Navigation } from "../Components/Navigation"
import "./BoardView.css"

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
            console.log('lists not found')
        }
    };

    const refreshLists = async function() { 
        const newList = {
            name: 'test list',
            cardIds: []
        }
        let response = await remote.addList(newList);
        if (response) {
            remote.updateBoard(match.params.boardId, response.uid)
            setLists([...lists, response]) 
        } else {
            console.log('error adding new list')
        }
    }
    
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
        let title = `${match.params.boardName} | Ello`;
        document.title = title;
    },[])

    if (isLoading) {
        return (
            <div>Please hold!</div>
        )
    } else {
        return (
            <div>
                <Navigation />
                <div className="boardDetailBar">
                    <h1>{match.params.boardName}</h1>
                </div>
                <div className="listsContainer">
                    {listDisplay}
                    <button className="add" onClick={refreshLists}>Add another list</button>
                </div>
            </div>
        )
    }
}