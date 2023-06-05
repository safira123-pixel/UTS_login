import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const Dashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Membuat koneksi ke broker MQTT
    const client = mqtt.connect('mqtt://broker.example.com');

    // Menangani event ketika terhubung ke broker
    client.on('connect', () => {
      console.log('Terhubung ke broker MQTT');

      // Berlangganan topik
      client.subscribe('topik/contoh');
    });

    // Menangani pesan yang diterima dari topik yang di-subscribe
    client.on('message', (topic, payload) => {
      console.log('Pesan baru:', payload.toString());
      setMessage(payload.toString());
    });

    // Membersihkan koneksi saat komponen unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>Dashboard MQTT</h1>
      <p>Pesan terbaru: {message}</p>
    </div>
  );
};

export default Dashboard;