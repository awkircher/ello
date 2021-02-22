import "./Card.css"

export const Card = function(props) {
    return (
        <div className="Card">{props.title}</div>
    )
}