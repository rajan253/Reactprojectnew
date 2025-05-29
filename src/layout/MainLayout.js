import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Sidemenu from '../components/Sidemenu';
import Footer from '../components/Footer';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Dashboard from '../Pages/Dashboard';
import StudentRegistrationForm from '../Pages/StudentRegistrionForm';
import Displaydata from '../Pages/Displaydata';
import Profile from '../Pages/Profile';
import Logout from '../Pages/Logout';


import GrievanceForm from '../Pages/GrievanceForm';
import GrivenceProcess from '../Pages/GrivenceProcess';
import './MainLayoutnew.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../loginpage/Login';

function MainLayout() {
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Hide banner when user navigates away from home
    if (location.pathname !== '/') {
      setShowBanner(false);
    }
  }, [location]);

  return (
    <div className="layout">
      <Header />
      <Sidemenu />
      <div className="main-content">
        
        {/* ✅ Show Welcome Banner only if condition is true */}
        {showBanner && (
          <div className="welcome-banner p-4 text-center bg-light shadow-sm rounded mt-3 mx-3">
            <h2>Welcome, {sessionStorage.getItem('userName') || 'Guest'}!</h2>
            <p className="lead">Glad to have you on the Transport System Dashboard.</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/displaydata" element={<Displaydata />} />
          <Route path="/studentRegistrationForm" element={<StudentRegistrationForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/grievanceForm" element={<GrievanceForm/>}/>
          <Route path='/grivenceProcess'  element={<GrivenceProcess/>} />
        </Routes>
      </div>
      <Profile />
    </div>
  );
}

export default MainLayout;
