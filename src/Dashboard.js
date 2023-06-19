//import React, { useEffect, useState } from 'react';
// import mqtt from 'mqtt';
//import Header from './HeaderDashboard';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const history = useHistory();

  const handleNavigate = () => {
    // Mengakses URL dashboard Laravel di tab baru
    window.open('http://localhost/dashboard', '_blank');
  };

  const handleLogout = () => {
    // Lakukan log out di sini, misalnya dengan menghapus token atau menghapus data autentikasi dari penyimpanan lokal (localStorage atau sessionStorage)

    // Redirect ke halaman login
    history.push('/login');
  };

  return (
    <div>
      <button onClick={handleNavigate}>Buka Dashboard Laravel</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}


export default Dashboard;