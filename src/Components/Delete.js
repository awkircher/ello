import './Delete.css'
import icon from '../icons/delete-icon.svg'

export const Delete = function(props) {
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