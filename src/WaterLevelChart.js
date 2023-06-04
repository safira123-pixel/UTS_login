import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import MQTT from 'react-mqtt';
import MQTT_CONFIG from './mqttConfig';

function WaterLevelChart() {
  const [historicalData, setHistoricalData] = useState([]);

  const handleMqttMessage = (topic, message) => {
    // Process MQTT messages here
    const newHistoricalData = [...historicalData, { x: Date.now(), y: parseFloat(message) }];
    setHistoricalData(newHistoricalData);
  };

  useEffect(() => {
    // Subscribe to MQTT topic
    const topic = 'water/level';
    MQTT.connect(MQTT_CONFIG);
    MQTT.subscribe(topic);

    // Unsubscribe and disconnect on component unmount
    return () => {
      MQTT.unsubscribe(topic);
      MQTT.disconnect();
    };
  }, []);

  useEffect(() => {
    // Create chart
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Water Level',
          data: historicalData,
          borderColor: 'blue',
          fill: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                minute: 'h:mm:ss a',
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      // Destroy chart on component unmount
      chart.destroy();
    };
  }, [historicalData]);

  return (
    <div className="WaterLevelChart">
      <h2>Historical Water Level</h2>
      <canvas id="chart"></canvas>
    </div>
  );
}

export default WaterLevelChart;