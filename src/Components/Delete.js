import './Delete.css'
import icon from '../icons/delete-icon.svg'

export const Delete = function(props) {
    if (props.appearance === "rectButton") {
        return (
            <div className={`Delete ${props.appearance}`}>
                <button
                onClick={(e) => {
                    e.preventDefault();
                    props.delete(props.uid)
                }}>
                    <img src={icon} alt="delete icon"></img> Archive
                </button>
            </div>
        )
    } else {
        return (
            <div className="Delete">
                <button
                onClick={(e) => {
                    e.preventDefault();
                    props.delete(props.uid)
                }}>
                    <img src={icon} alt="delete icon"></img>
                </button>
            </div>
        )
    }
}