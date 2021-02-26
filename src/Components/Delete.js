export const Delete = function(props) {
    return (
        <div className="Delete">
            <button
            onClick={(e) => {
                e.preventDefault();
                props.delete(props.uid)
            }}>Delete</button>
        </div>
    )
}