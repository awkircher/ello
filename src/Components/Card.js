import { Delete } from "./Delete";
import "./Card.css"

export const Card = function(props) {
    return (
        <div className="Card" data-uid={props.cardId}>
            {props.title}
            <Delete
                uid={props.cardId}
                delete={props.deleteCard} />
        </div>
    )
}