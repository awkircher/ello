import { useState, useEffect } from 'react'
import './Description.css'
import cancel from "../icons/cancel-icon.svg"

export const Description = function(props) {
    const [isActive, setIsActive] = useState(false)
    const [text, setText] = useState(props.description)

    const clickToCancel = function(event) {
        const elem = event.target;
        const action = elem.dataset.action
        if (action !== "ignore") 
        {
            setIsActive(false)
            setText(props.description)
        } else {
            return;
        }
    }

    const showControls = function(isActive) {
        if (!isActive) {
            return null;
        } else {
            return (
                <div className="controls">
                    <button data-action="ignore" type="submit"
                        onClick={() => {
                            props.update(props.uid, 'description', text)
                            setText(text)
                            setIsActive(false)}}>
                        Save
                    </button>
                    <button data-action="ignore" className="cancel"
                        onClick={() => {
                            setIsActive(false)
                            setText(props.description)}}>
                        <img data-action="ignore" src={cancel} alt="cancel icon"></img>
                    </button>
                </div>
            )
        }
    }

    useEffect(() => {
        if (isActive) {
            window.addEventListener('click', clickToCancel)
        }
        return function cleanUp() {
            window.removeEventListener('click', clickToCancel)
        }
    })

    return (
        <div className="Description"> 
            <h2>Description</h2>
            <textarea 
                data-action="ignore"
                placeholder="Add a more detailed description..." 
                value={text}
                onFocus={() => setIsActive(true)}
                onChange={(event) => setText(event.target.value)}>
            </textarea>
            {showControls(isActive)}
        </div>
    )
}