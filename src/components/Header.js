import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    userId: '',
  });

  useEffect(() => {
    const name = sessionStorage.getItem('userName');
    const email = sessionStorage.getItem('userEmail');
    const userId = sessionStorage.getItem('userId');

    setProfile({ name, email, userId });
  }, []);

  const closeModal = () => {
    // Manually close the modal using Bootstrap's modal API
    const modal = new window.bootstrap.Modal(document.getElementById('profile'));
    modal.hide();
  };

  return (
    <header className="header">
      <div className="logo">Transport System</div>
      <nav className="buttonx">
        {/* <Link to="/">Home</Link> */}
        {/* <Link to="/dashboard">Dashboard</Link> */}
        {/* <Link to="/about">About</Link> */}
        {/* <Link to="/studentRegistrationForm">Student Registration Form</Link>
        <Link to="/displaydata">Display Data</Link> */}
        {/* <Link to="/profile" className="btn btn-primary">Profile</Link> */}
        <Link to="/logout" className="btn btn-danger" >Logout</Link>
      </nav>
  <button
        className="btn btn-outline-light"
        data-bs-toggle="modal"
        data-bs-target="#profileModal"
      >
        <i className="bi bi-person-circle me-1"></i> Profile
      </button>
      {/* Modal to Show Profile Info */}
      
      
    </header>
  );
};

export default Header;
