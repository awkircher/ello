import { useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea';
import './Title.css'
import title from '../icons/title-icon.svg'

export const Title = function(props) {
    //const [isActive, setIsActive] = useState(false)
    const [text, setText] = useState(props.title)

    return (
        <div className="titleSection">
            <img src={title} alt="title icon"></img>
            <div className="titleDetails">
                <TextareaAutosize
                    value={text}
                    rows={1}
                    onChange={(event) => setText(event.target.value)}
                    onBlur={(event) => {
                        const content = (event.target.value === "") ? props.title : event.target.value;
                        props.update(props.uid, 'title', content)
                        setText(content);
                        }}>
                </TextareaAutosize>
                <p className="subhead">in list <span className="actionText">{props.parentList}</span></p>
            </div>
        </div>
    )
}