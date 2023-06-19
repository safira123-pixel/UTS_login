import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import mqtt from 'mqtt';
import './assets/scss/Dashboard.scss'
import Header from './HeaderDashboard';

const App = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [isBuzzerOn, setIsBuzzerOn] = useState(false);
  const [waterLevelHistory, setWaterLevelHistory] = useState([]);

  // Konfigurasi koneksi MQTT
  const mqttOptions = {
    clientId: 'mqtt-dashboard',
    username: 'your-mqtt-username',
    password: 'your-mqtt-password',
    clean: true,
  };

  // Buat koneksi MQTT
  const mqttClient = mqtt.connect('mqtt://your-mqtt-broker-url', mqttOptions);

  // Subscribes ke topik MQTT yang relevan
  const subscribeToTopics = () => {
    mqttClient.subscribe('waterLevel');
    mqttClient.subscribe('pumpStatus');
    mqttClient.subscribe('buzzerStatus');
    mqttClient.subscribe('waterLevelHistory');
  };

  // Mendapatkan data dari topik MQTT
  const handleMQTTMessage = (topic, message) => {
    const data = JSON.parse(message.toString());
    switch (topic) {
      case 'waterLevel':
        setWaterLevel(data.waterLevel);
        break;
      case 'pumpStatus':
        setIsPumpOn(data.isPumpOn);
        break;
      case 'buzzerStatus':
        setIsBuzzerOn(data.isBuzzerOn);
        break;
      case 'waterLevelHistory':
        setWaterLevelHistory(data.waterLevelHistory);
        break;
      default:
        break;
    }
  };

  // Menghubungkan ke broker MQTT saat komponen dirender
  useEffect(() => {
    mqttClient.on('connect', () => {
      subscribeToTopics();
    });

    mqttClient.on('message', (topic, message) => {
      handleMQTTMessage(topic, message);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  // Format data water level history untuk digunakan oleh Chart.js
  const formatWaterLevelHistoryData = () => {
    return {
      labels: waterLevelHistory.map(data => data.date),
      datasets: [
        {
          label: 'Water Level',
          data: waterLevelHistory.map(data => data.level),
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="dashboard">
      <div><Header/> </div>
      <div className="water-level-indicator">
        <h2>Water Level Indicator</h2>
        <div className={`water-level ${waterLevel > 70 ? 'high' : waterLevel > 30 ? 'medium' : 'low'}`}>
Water Level: {waterLevel}%
</div>
</div>

  <div className="status-indicators">
    <div className={`pump-indicator ${isPumpOn ? 'on' : 'off'}`}>
      Pump: {isPumpOn ? 'On' : 'Off'}
    </div>
    <div className={`buzzer-indicator ${isBuzzerOn ? 'on' : 'off'}`}>
      Buzzer: {isBuzzerOn ? 'On' : 'Off'}
    </div>
  </div>

  <div className="water-level-history">
    <h2>Water Level History</h2>
    {waterLevelHistory.length > 0 ? (
      <Line
        data={formatWaterLevelHistoryData()}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              stepSize: 10,
            },
          },
        }}
      />
    ) : (
      <p>No data available</p>
    )}
  </div>
</div>

); };

export default App;