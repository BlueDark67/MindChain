import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Metrics.css";
import "../../Global.css";

function Metrics() {
    useEffect(() => {
        document.title = "Metrics";
        document.body.classList.add("gradient_background_BB");

        return () => {
            document.body.classList.remove("gradient_background_BB");
        };
    }, []);

    const navigate = useNavigate();

    const changePage = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="container-wrapperMetrics">
            <div className="containerMetrics">
                <h1 className="metrics">Metrics</h1>
                <div className="info-box-metrics">
                    <label className="label-metrics">
                        <b className="bmetrics">Number of brainstorming sessions</b>
                        <p className="pmetrics"> 47</p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Average time per session</b>
                        <p className="pmetrics">30 minutes</p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Time brainstorming</b>
                        <p className="pmetrics">1 day 12 hours and 30 minutes</p>
                    </label>
                    <label className="label-metrics">
                        <b className="bmetrics">Favorite theme</b>
                        <p className="pmetrics">Food</p>
                    </label>
                </div>
            </div>
        </div>
    );
}
export default Metrics;