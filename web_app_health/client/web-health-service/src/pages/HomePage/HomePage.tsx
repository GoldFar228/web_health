import { useState } from "react";
import "./HomePage.css"
import TaskComponent from "../../components/TaskComponent/TaskComponent";

function HomePage() {
    const [todoList, setTodoList] = useState([]);
    const [completedTodoList, setCompletedTodoList] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask(event.target.value)
    }
    const addTask = () => {
        const task = {
            id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
            taskName: newTask,
            completed: false
        };
        setTodoList([...todoList, task]);
    }
    const deleteTask = (id: number) => {
        setTodoList(todoList.filter((task) => {
            if (task.id === id) {
                return false
            } else {
                return true
            }
        }))
    }
    const completeTask = (id: number) => {
        setTodoList(todoList.map(item => {
            if (item.id === id)
                return { ...item, completed: true }
            return item
        }))

        console.log(todoList)
    }
    return (
        <>
            <input type="text" placeholder="enter some text" onChange={handleChange}></input>
            <button onClick={addTask}>click me</button>
            {/* <div>{newTask}</div>  */}
            <div>
                {todoList.map((task) => {
                    return (
                        <TaskComponent
                            taskName={task.taskName}
                            id={task.id}
                            completed={task.completed}
                            completeTask={completeTask}
                            deleteTask={deleteTask}
                            addTask={addTask}
                        />
                    )
                })}
            </div>
        </>
    );
}


export default HomePage;