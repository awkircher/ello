import { useState } from 'react'
import './Add.css'
import cancel from '../icons/cancel-icon.svg'

export const Add = function(props) {
    const [isActive, setIsActive] = useState(false)

    if (!isActive) {
        return (
            <div className={`Add ${props.source}`}>
                <button onClick={() => setIsActive(true)}>
                    &#43; Add another {props.source}
                </button>
            </div>
        )
    } else {
        if (props.source === 'list') {
            return (
                <div className="addList">
                    <form onSubmit={
                        (event) => {
                            event.preventDefault();
                            const value = event.target[0].value
                            props.add(value)
                            setIsActive(false)
                            }}>
                        <input type="text" placeholder="Enter list title..." autoFocus='true'></input>
                        <button type="submit">Add</button>
                        <button className="cancel" onClick={() => setIsActive(false)}>
                            <img src={cancel} alt="cancel icon"></img>
                        </button>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="addCard">
                    <form onSubmit={
                        (event) => {
                            event.preventDefault();
                            const value = event.target[0].value
                            props.add(value)
                            setIsActive(false)
                            }}>
                        <textarea placeholder="Enter a title for this card..." autoFocus='true'></textarea>
                        <button type="submit">Add</button>
                        <button className="cancel" onClick={() => setIsActive(false)}>
                            <img src={cancel} alt="cancel icon"></img>
                        </button>
                    </form>
                </div>
            )
        }
    }
}