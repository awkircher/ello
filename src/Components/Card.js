import { useState, useEffect } from 'react'
import { Delete } from "./Delete";
import { Description } from "./Description"
import "./Card.css"
import cancel from '../icons/cancel-icon.svg'
import title from '../icons/title-icon.svg'

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
                            <div className="editableSections">
                                <div className="titleSection">
                                    <img src={title} alt="title icon"></img>
                                    <div className="titleDetails">
                                        <h1>{props.title}</h1>
                                        <p className="subhead">in list <span className="actionText">{props.parentList}</span></p>
                                    </div>
                                </div>
                                <Description
                                    uid={props.cardId} 
                                    description={props.description}
                                    update={props.update} />
                            </div>
                            <div className="sideMenu">
                                <button className="close" onClick={() => setIsOpen(false)}>
                                    <img src={cancel} alt="cancel icon"></img>
                                </button>
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