import {  useContext } from "react";
import "./ContextComponent.css"
import {AppContext} from "../../App"


const ContextComponent = () => {
    const {username} = useContext(AppContext);
    return (
        <>
            <h1>
                {username}
            </h1>
        </>
    );
}


export default ContextComponent;