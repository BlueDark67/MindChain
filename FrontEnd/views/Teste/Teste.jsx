import { useState } from "react";
import { defaultNames, namesAsLis, handleClick } from "../../public/js/fetchAPI";

function Teste() {
    const [names, setNames] = useState(defaultNames);

    return(
        <div>
            <h1>Teste</h1>
            <ul>
                {namesAsLis(names)}
            </ul>
            <button onClick={() => handleClick(setNames)}>Update names</button>
        </div>
    );

}

export default Teste;