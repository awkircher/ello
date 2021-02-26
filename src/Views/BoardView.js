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
            cardIds: null
        }
        let addedList = await remote.addList(newList);
        if (addedList) {
            remote.updateBoard(match.params.boardId, addedList.uid)
            setLists([...lists, addedList]) 
        } else {
            console.log('error adding new list')
        }
    }

    const deleteList = async function(listId) {
        let response = await remote.deleteList(listId);
        if (response === undefined) {
            remote.removeFromBoard(match.params.boardId, listId)
            const copyOfLists = lists.slice();
            const isList = (list) => list.uid === listId;
            const indexOfMatch = copyOfLists.findIndex(isList);
            copyOfLists.splice(indexOfMatch, 1)
            setLists(copyOfLists)
        } else {
            console.log('there was an error deleting the list')
        }
    }
    
    const listDisplay = lists.map((list) =>
        <div key={list.uid}>
            <List 
                deleteList={deleteList}
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
                <div className="boardContainer">
                    <div className="boardDetailBar">
                        <h1>{match.params.boardName}</h1>
                    </div>
                    <div className="listsContainer">
                        {listDisplay}
                        <button className="add" onClick={refreshLists}>Add another list</button>
                    </div>
                </div>
            </div>
        )
    }
}