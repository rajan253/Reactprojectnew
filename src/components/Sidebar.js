// components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, Route, Router } from 'react-router-dom';

import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '➡️' : '⬅️'}
      </button>
      <NavLink to="/" activeclassname="active"> Home</NavLink>
      <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
      <NavLink to="/about" activeclassname="active"> About</NavLink>
    </aside>

    
  );
};

export default Sidebar;
