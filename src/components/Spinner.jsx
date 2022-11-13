import {GiWormMouth} from "react-icons/gi";

function Spinner() {
    return (
        <div className="spinner">
            <GiWormMouth style={{fontSize:"80px"}} className="rotating"/>
        </div>
    )
}

export default Spinner;