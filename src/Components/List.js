import { useState, useEffect } from 'react'
import { Card } from './Card'
import { api } from '../API/api'
import "./List.css"

export const List = function(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [cards, setCards] = useState([])
    const remote = api()
    
    const initCards = async function(listId) {
        if (!listId) {
            return;
        }
        let response = await remote.getCardsByListId(listId);
        if (response) {
            setCards(response)
            setIsLoading(false)
        } else {
            console.log('not found')
        }
    };
    
    const cardDisplay = cards.map((card) =>
        <div key={card.uid}>
            <Card 
                title={card.title}
            />
        </div>
    );
    
    useEffect(() => {
        initCards(props.listId);
    },[])

    if (isLoading) {
        return (
            <div>please hold!</div>
        )
    } else {
        return (
            <div className="List">
                <p className="listName">{props.name}</p>
                {cardDisplay}
            </div>
        )
    }
}