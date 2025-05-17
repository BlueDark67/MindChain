import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { fetchUserProgress } from '../../../public/js/Progress';
import './Progress.css';

function Progress() {
    const [brainstormingData, setBrainstormingData] = useState({});
    const [messagesData, setMessagesData] = useState({});
    const [comparisonText, setComparisonText] = useState("");

    useEffect(() => {
        document.title = "Progress";
        document.body.classList.add('gradient_background_BB', 'allow_scroll');

        // Busca os dados do usuário ao carregar o componente
        fetchUserProgress(localStorage.getItem("userId")).then((data) => {
            if (data) {
                setBrainstormingData(data.brainstormingByMonth);
                setMessagesData(data.messagesBySession);

                // Calcula a comparação de brainstorming
                calculateComparison(data.brainstormingByMonth);
            }
        });

        return () => {
            document.body.classList.remove('gradient_background_BB', 'allow_scroll');
        };
    }, []);


    // Dados fictícios para o gráfico de linha (Brainstorming por mês)
    const mockBrainstormingData = {
        January: 5,
        February: 3,
        March: 8,
        April: 6,
        May: 4,
    };

    // Dados fictícios para o gráfico de barras (Mensagens por sessão)
    const mockMessagesData = {
        "Session 1": 10,
        "Session 2": 15,
        "Session 3": 7,
        "Session 4": 12,
        "Session 5": 9,
    };

    // Configuração do gráfico de linha
    const lineChartData = {
        labels: Object.keys(mockBrainstormingData), // Meses
        datasets: [
            {
                label: "Brainstorming Sessions",
                data: Object.values(mockBrainstormingData), // Quantidade de sessões por mês
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    // Configuração do gráfico de barras
    const barChartData = {
        labels: Object.keys(mockMessagesData), // Sessões
        datasets: [
            {
                label: "Messages per Session",
                data: Object.values(mockMessagesData), // Quantidade de mensagens por sessão
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