import React, { useEffect, useState } from 'react';
import WaterLevelChart from './WaterLevelChart';

function Dashboard() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isPumpOn, setPumpOn] = useState(false);
  const [isBuzzerOn, setBuzzerOn] = useState(false);

  useEffect(() => {
    // Simulate changing water level, pump status, and buzzer status
    const interval = setInterval(() => {
      const newWaterLevel = Math.random() * 100; // Replace with MQTT data
      setWaterLevel(newWaterLevel);

      const newPumpStatus = Math.random() > 0.5; // Replace with MQTT data
      setPumpOn(newPumpStatus);

      const newBuzzerStatus = Math.random() > 0.5; // Replace with MQTT data
      setBuzzerOn(newBuzzerStatus);
    }, 1000);

    return () => {
      clearInterval(interval);
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
      <h1>Water Level Dashboard</h1>
      <h2>Water Level: {waterLevel} cm</h2>
      <div className="Indicators">
        <div className={`Indicator ${isPumpOn ? 'active' : ''}`}>
          <h3>Pump</h3>
          {isPumpOn ? <span className="status">ON</span> : <span className="status">OFF</span>}
        </div>
        <div className={`Indicator ${isBuzzerOn ? 'active' : ''}`}>
          <h3>Buzzer</h3>
          {isBuzzerOn ? <span className="status">ON</span> : <span className="status">OFF</span>}
        </div>
      </div>
      <div className={`LevelIndicator ${getLevelIndicatorClass()}`}>
        {waterLevel}
      </div>
      <WaterLevelChart />
    </div>
  );
}

export default Dashboard;