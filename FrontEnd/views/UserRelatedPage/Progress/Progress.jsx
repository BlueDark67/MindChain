import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { fetchUserProgress } from '../../../public/js/Progress';
import './Progress.css';

function Progress() {
    const [brainstormingData, setBrainstormingData] = useState({});
    const [messagesData, setMessagesData] = useState({});

    useEffect(() => {
        document.title = "Progress";
        document.body.classList.add('gradient_background_BB', 'allow_scroll');

        // Busca os dados do usuário ao carregar o componente
        fetchUserProgress(localStorage.getItem("userId")).then((data) => {
            if (data) {
                setBrainstormingData(data.brainstormingByMonth);
                setMessagesData(data.messagesBySession);
            }
        });

        return () => {
            document.body.classList.remove('gradient_background_BB', 'allow_scroll');
        };
    }, []);

    // Configuração do gráfico de linha
    const lineChartData = {
        labels: Object.keys(brainstormingData), // Meses
        datasets: [
            {
                label: "Brainstorming Sessions",
                data: Object.values(brainstormingData), // Quantidade de sessões por mês
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };


    // Configuração do gráfico de barras
    const barChartData = {
        labels: Object.keys(messagesData), // Sessões
        datasets: [
            {
                label: "Messages per Session",
                data: Object.values(messagesData), // Quantidade de mensagens por sessão
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="progress-container">
            <h1>Progress</h1>
            <div className="progresscontent-container">
                {/* Gráfico de Linha */}
                <div className="chart-container">
                    <h2>Brainstorming Sessions by Month</h2>
                    <Line data={lineChartData} />
                </div>

                {/* Gráfico de Barras */}
                <div className="chart-container">
                    <h2>Messages per Session</h2>
                    <Bar data={barChartData} />
                </div>
            </div>
        </div>
    );
}

export default Progress;