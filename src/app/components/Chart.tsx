"use client";

import ApexChart from 'react-apexcharts';

interface Props {
    data: {
        candles: {
            x: Date,
            y: [number, number, number, number]
        }[],
        support: { x: Date, y: number }[],
        resistance: { x: Date, y: number }[]
    }
}

export default function Chart(props: Props) {
    const state = {
        series: [
            {
                name: "candles",
                type: "candlestick",
                data: props.data.candles
            },
            {
                name: "support",
                type: 'line',
                data: props.data.support,
                color: '#00f', // Ajuste a cor conforme necessário
                strokeDashArray: 3
            },
            {
                name: "resistance",
                type: 'line',
                data: props.data.resistance,
                color: '#f00', // Ajuste a cor conforme necessário
                strokeDashArray: 3
            }
        ],
        options: {
            chart: {
                type: 'candlestick',
                background: '#333',
                foreColor: '#fff',
                toolbar: {
                    show: true
                }
            },
            title: {
                text: 'Candlestick Chart',
                align: 'left',
                style: {
                    fontSize: '20px',
                    color: '#fff',
                },
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    style: {
                        colors: '#fff',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#fff',
                    },
                },
            },
            tooltip: {
                theme: 'dark',
            },
            plotOptions: {
                candlestick: {
                    colors: {
                        upward: '#00B746',
                        downward: '#EF403C',
                    },
                },
            },
            grid: {
                borderColor: '#444',
            },
            stroke: {
                curve: 'smooth',
                width: 2
            }
        },
    };

    return (
        <div>
            <div className="chart-box">
                <div id="chart-candlestick">
                    <ApexChart 
                        options={state.options} 
                        series={state.series} 
                        type="candlestick" 
                        height={290} 
                    />
                </div>
            </div>
            <div id="html-dist"></div>
        </div>
    );
}
