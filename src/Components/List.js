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

    const refreshWithNewCard = async function(input) { 
        const newCard = {
            title: input,
            description: ""
        }
        let addedCard = await remote.addCard(newCard);
        if (addedCard) {
            remote.updateList(props.listId, addedCard.uid)
            setCards([...cards, addedCard]) 
        } else {
            console.log('error adding new card')
        }
    }

    const refreshWithUpdatedCard = async function(cardId, key, value) {
        let updatedCard = await remote.updateCard(cardId, key, value);
        if (updatedCard) {
            const cardsCopy = cards.slice();
            const isCard = card => card.uid === cardId;
            const indexOfMatch = cardsCopy.findIndex(isCard);
            switch (key) {
                case 'title':
                    cardsCopy[indexOfMatch].title = value;
                    break;
                case 'description':
                    cardsCopy[indexOfMatch].description = value;
                    break;
                default: 
                    console.log('no such key');
            }
            setCards(cardsCopy)
        } else {
            console.log('error updating card')
        }
    }

    const deleteCard = async function(cardId) {
        let response = await remote.deleteCard(cardId);
        if (response === undefined) {
            remote.removeFromList(props.listId, cardId)
            const cardsCopy = cards.slice();
            const isCard = (card) => card.uid === cardId;
            const indexOfMatch = cardsCopy.findIndex(isCard);
            cardsCopy.splice(indexOfMatch, 1)
            setCards(cardsCopy)
        } else {
            console.log('there was an error deleting the card')
        }
    }
    
    const cardDisplay = cards.map((card) =>
        <div className="cardContainer" key={card.uid}>
            <Card 
                deleteCard={deleteCard}
                cardId={card.uid}
                title={card.title}
                description={card.description}
                parentList={props.name}
                update={refreshWithUpdatedCard}
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
                    add={refreshWithNewCard}
                />
            </div>
        )
    }
}