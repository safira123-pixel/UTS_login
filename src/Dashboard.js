import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import Header from './HeaderDashboard';

function Dashboard() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isPumpOn, setPumpOn] = useState(false);
  const [isBuzzerOn, setBuzzerOn] = useState(false);

  useEffect(() => {
    // Membuat koneksi ke broker MQTT
    const client = mqtt.connect('https://www.hivemq.com/public-mqtt-broker/');

    // Menangani event ketika terhubung ke broker
    client.on('connect', () => {
      console.log('Terhubung ke broker MQTT');

      // Berlangganan topik
      client.subscribe('water-level');
      client.subscribe('pump-status');
      client.subscribe('buzzer-status');
    });

    // Menangani pesan yang diterima dari topik yang di-subscribe
    client.on('message', (topic, payload) => {
      const message = payload.toString();
      console.log(`Pesan baru pada topik ${topic}: ${message}`);

      // Memperbarui state berdasarkan topik pesan
      switch (topic) {
        case 'water-level':
          setWaterLevel(parseFloat(message));
          break;
        case 'pump-status':
          setPumpOn(message === 'ON');
          break;
        case 'buzzer-status':
          setBuzzerOn(message === 'ON');
          break;
        default:
          break;
      }
    });

    // Membersihkan koneksi saat komponen unmount
    return () => {
      client.end();
    };
  }, []);

  const getLevelIndicatorClass = () => {
    if (waterLevel <= 30) {
      return 'low';
    } else if (waterLevel <= 70) {
      return 'medium';
    } else {
      return 'high';
    }
  };

  return (
    <div className="Dashboard">
    <div><Header/> </div>
    <div className="rectangle1">
    <h3>Water Level Indicator</h3>
      <h2>Water Level: {waterLevel} cm</h2>
      </div>
      <div className="Rectangle2">
      <h3>Pump Indicator</h3>
        <div className={`Indicator ${isPumpOn ? 'active' : ''}`}>
          {isPumpOn ? <span className="status">ON</span> : <span className="status">OFF</span>}
        </div>
        </div>
        <div className="Rectangle3">
        <h3>Buzzer Indicator</h3>
        <div className={`Indicator ${isBuzzerOn ? 'active' : ''}`}>
          {isBuzzerOn ? <span className="status">ON</span> : <span className="status">OFF</span>}
        </div>
        </div>
        <div className="Rectangle4">
        <h3>Water Level</h3>
      <div className={`LevelIndicator ${getLevelIndicatorClass()}`}>
        {waterLevel}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;