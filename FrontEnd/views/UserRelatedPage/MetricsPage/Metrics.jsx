import { useEffect } from "react";
import { useState } from "react";
import "./Metrics.css";
import "../../Global.css";
import { fetchUserMetrics } from "../../../public/js/Metrics";

function Metrics() {
    const userId = localStorage.getItem("userId");

    const [numberOfSessions, setNumberOfSessions] = useState(0);
    const [averageTime, setAverageTime] = useState(0);
    const [timeBrainstorming, setTimeBrainstorming] = useState(0);
    const [favoriteTheme, setFavoriteTheme] = useState("");

    useEffect(() => {
        document.title = "Metrics";
        document.body.classList.add("gradient_background_BB");

        fetchUserMetrics(userId).then((data) => {
            console.log("data", data);
            if (data) {
                setNumberOfSessions(data.numberSessions);
                setAverageTime(data.averageTime);
                setTimeBrainstorming(data.timeBrainstorming);
                setFavoriteTheme(data.favoriteTheme);
            }
        });

        return () => {
            document.body.classList.remove("gradient_background_BB");
        };
    }, []);

    return (
        <div className="container-wrapperMetrics">
            <div className="containerMetrics">
                <h1 className="metrics">Metrics</h1>
                <div className="info-box-metrics">
                    <label className="label-metrics">
                        <b className="bmetrics">Number of brainstorming sessions</b>
                        <p className="pmetrics"> {numberOfSessions}</p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Average time per session</b>
                        <p className="pmetrics">{Math.floor(averageTime / 60)} min {Math.round(averageTime % 60)} s</p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Time brainstorming</b>
                        <p className="pmetrics">{Math.floor(timeBrainstorming / 86400)} day{" "}
                                                {Math.floor((timeBrainstorming % 86400) / 3600)} hours{" "}
                                                {Math.floor((timeBrainstorming % 3600) / 60)} min{" "}
                                                {Math.round(timeBrainstorming % 60)} s
                        </p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Favorite theme</b>
                        <p className="pmetrics">{favoriteTheme}</p>
                    </label>
                </div>
            </div>
        </div>
    );
}
export default Metrics;