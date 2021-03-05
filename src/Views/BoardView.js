import { useState, useEffect } from "react"
import { useRouteMatch } from "react-router-dom"
import { api } from "../API/api"
import { List } from "../Components/List"
import { Navigation } from "../Components/Navigation"
import { Add } from "../Components/Add"
import "./BoardView.css"
import "./BackgroundSettings.css"

export const BoardView = function(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [lists, setLists] = useState([])
    const [settings, setSettings] = useState('default')
    const remote = api()
    const match = useRouteMatch();
    
    const initLists = async function(boardId) {
        if (!boardId) {
            return;
        }
        let boardResponse = await remote.getBoard(boardId);
        if (boardResponse) {
            setSettings(boardResponse.background)
        } else {
            console.log('board not found')
        }
        let listsResponse = await remote.getListsByBoardId(boardId);
        if (listsResponse) {
            setLists(listsResponse)
            setIsLoading(false)
        } else {
            console.log('lists not found')
        }
    };

    const refreshLists = async function(input) { 
        const newList = {
            name: input,
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
            <div>
                <Navigation 
                    background={settings} />
            </div>
        )
    } else {
        return (
            <div>
                <Navigation 
                    background={settings} />
                <div className={`boardContainer ${settings}`}>
                    <div className="boardDetailBar">
                        <h1>{match.params.boardName}</h1>
                    </div>
                    <div className="listsContainer">
                        {listDisplay}
                        <Add 
                            source="list"
                            add={refreshLists}
                        />
                    </div>
                </div>
            </div>
        )
    }
}