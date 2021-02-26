import { useState, useEffect } from 'react'
import { Card } from './Card'
import { api } from '../API/api'
import { Delete } from './Delete'
import { Add } from './Add'
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
        if (response === 'no cards in this list') {
            setCards([])
            setIsLoading(false)
        } else if (response) {
            setCards(response)
            setIsLoading(false)
        } else {
            console.log('somthing went wrong')
        }
    };

    const refreshCards = async function(input) { 
        const newCard = {
            title: input,
        }
        let addedCard = await remote.addCard(newCard);
        if (addedCard) {
            remote.updateList(props.listId, addedCard.uid)
            setCards([...cards, addedCard]) 
        } else {
            console.log('error adding new card')
        }
    }

    const deleteCard = async function(cardId) {
        let response = await remote.deleteCard(cardId);
        if (response === undefined) {
            remote.removeFromList(props.listId, cardId)
            const copyOfCards = cards.slice();
            const isCard = (card) => card.uid === cardId;
            const indexOfMatch = copyOfCards.findIndex(isCard);
            copyOfCards.splice(indexOfMatch, 1)
            setCards(copyOfCards)
        } else {
            console.log('there was an error deleting the card')
        }
    }
    
    const cardDisplay = cards.map((card) =>
        <div key={card.uid}>
            <Card 
                deleteCard={deleteCard}
                cardId={card.uid}
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
                <div className="listName">
                    {props.name}
                    <Delete 
                        uid={props.listId}
                        delete={props.deleteList}
                    />
                </div>
                {cardDisplay}
                <Add 
                    source="card"
                    add={refreshCards}
                />
            </div>
        )
    }
}