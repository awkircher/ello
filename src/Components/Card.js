import { useState, useEffect } from 'react'
import { Delete } from "./Delete";
import { Description } from "./Description"
import { Title } from "./Title"
import "./Card.css"
import cancel from '../icons/cancel-icon.svg'

export const Card = function(props) {
    const [isOpen, setIsOpen] = useState(false)

    //This check prevents the click event from the Delete button from 
    //also briefly opening the Card modal.
    const handleClick = function(event) {
        const action = event.target.dataset.action;
        if (action === 'controlCard') {
            setIsOpen(true)
        }
    }

    const clickToClose = function(event) {
        const action = event.target.dataset.action;
        if (action === 'closeCard') {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', clickToClose);
            console.log('window is listening')
        }
        return function cleanUp() {
            window.removeEventListener('click', clickToClose)
        }
    })

    if (!isOpen) {
        return (
            <div className="Card closed" data-action="controlCard" onClick={(event) => handleClick(event)}>
                {props.title}
                <Delete
                    uid={props.cardId}
                    delete={props.deleteCard} />
                {/* `modal` is display:none while Card is closed */}
                <div className="modal"></div>
            </div>
        )
    } else {
        return (
            /* Card in List is still visible in the background when `open` */
            <div className="Card open">
                {props.title}
                <Delete
                    uid={props.cardId}
                    delete={props.deleteCard} />
                <div className="modal" data-action="closeCard">
                    <div className="cardContentsContainer" data-action="closeCard">
                        <div className="cardContents">
                            <Title 
                                uid={props.cardId}
                                title={props.title}
                                parentList={props.parentList}
                                update={props.update} />
                            <button className="close" onClick={() => setIsOpen(false)}>
                                    <img src={cancel} alt="cancel icon"></img>
                            </button>
                            <div className="editableSections">
                                <Description
                                    uid={props.cardId} 
                                    description={props.description}
                                    update={props.update} />
                            </div>
                            <div className="sideMenu">
                                <h4 className="sectionHeader">Actions</h4>
                                <Delete
                                    appearance="rectButton"
                                    uid={props.cardId}
                                    delete={props.deleteCard} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}