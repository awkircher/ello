import { useState } from 'react'
import './Add.css'

export const Add = function(props) {
    const [isActive, setIsActive] = useState(false)

    if (!isActive) {
        return (
            <div className="Add">
                <button onClick={() => setIsActive(true)}>
                    Add another {props.source}
                </button>
            </div>
        )
    } else {
        return (
            <div className="Form">
                <form onSubmit={
                    (event) => {
                        event.preventDefault();
                        const value = event.target[0].value
                        props.add(value)
                        setIsActive(false)
                        }}>
                    <input type="text"></input>
                    <button type="submit">Add</button>
                </form>
            </div>
        )
    }
}