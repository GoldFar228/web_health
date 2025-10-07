import { useEffect, useState } from "react";
import "./ExcusePage.css"
import axios from "axios";

function ExcusePage() {
    const [excuse, setExcuse] = useState("");
    const [name, setName] = useState("");

    const checkWork = () => {
        axios.get(`https://api.agify.io/?name=${name}`).then((res) =>
            setExcuse(res.data.age));
    }
    const handleClick = (str: string) => {
        axios.get(`https://excuser.herokuapp.com`).then((res) =>
            setExcuse(res.data));
        
    }
    // useEffect(() => {
    //     handleClick('Party');
    //     axios.get(`https://api.agify.io/?name=${name}}`).then((res) =>
    //         console.log(res.data.count));
        
    // }, [])
    return (
        <>
            <h1>
                Generate excuse
            </h1>
            <input type="text" placeholder="type" onChange={(event) => setName(event.target.value)}/>
            <div>{excuse}</div>
            <div>
                <button onClick={checkWork}>test</button>
                <button onClick={() => handleClick('Party')}>Party</button>
                <button onClick={() => handleClick('Family')}>Family</button>
                <button onClick={() => handleClick('')}>Tragedy</button>
            </div>
        </>
    );
}


export default ExcusePage;