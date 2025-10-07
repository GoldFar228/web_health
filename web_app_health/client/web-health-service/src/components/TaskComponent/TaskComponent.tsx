import "./TaskComponent.css"

const TaskComponent = (props) => {
    return (
        <>
            <div key={props.id}>
                <span className={props.completed ? "completed" : ""}>{props.taskName}</span>
                <button onClick={() => props.completeTask(props.id)}>Complete</button>
                <button onClick={() => props.deleteTask(props.id)}>delete</button>
            </div>
        </>
    );
}


export default TaskComponent;