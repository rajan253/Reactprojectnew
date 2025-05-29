import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidemenu.css'; // Custom styles

// Menu data
const menuData = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: 'bi-house-door',
  },
   {
    title: 'Student Registration',
    icon: 'bi-card-list',
    children: [
      { title: 'Student Data List', link: '/displaydata', icon: 'bi-list' },
      { title: 'Student Registration', link: '/studentRegistrationForm', icon: 'bi-person-add' },
    ],
  },
  {
    title: 'Users',
    icon: 'bi-person-fill',
    children: [
      { title: 'Add User', link: '/users/add', icon: 'bi-person-plus' },
      { title: 'Manage Users', link: '/users/manage', icon: 'bi-person-lines-fill' },
    ],
  },
  {
title:'Grivence',
icon:'bi-card-list',
children:[
{title:'Student Grivence',link:'/grievanceForm',icon:'bi-list'},
{title:'Student Grivence Process',link:'/grivenceProcess',icon:'bi-person-lines-fill'},
],
  },
  {
    title: 'Settings',
    icon: 'bi-gear-fill',
    children: [
      { title: 'Profile', link: '/settings/profile', icon: 'bi-person-circle' },
      { title: 'Security', link: '/settings/security', icon: 'bi-shield-lock' },
    ],
  },
 
];

const SideMenu = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index); // Toggle the menu open/close
  };

  return (
    <div className="side-menu bg-dark text-white">
      <ul className="list-unstyled">
        {menuData.map((item, index) => (
          <li key={index} className={`menu-item ${openMenu === index ? 'active' : ''}`}>
            <div className="menu-title" onClick={() => item.children && toggleMenu(index)}>
              <i className={`bi ${item.icon} me-2`}></i> {item.title}
              {item.children && (
                <i
                  className={`bi bi-caret-${openMenu === index ? 'down' : 'right'} float-end`}
                ></i>
              )}
            </div>
            {item.children && openMenu === index && (
              <ul className="submenu list-unstyled ps-4">
                {item.children.map((child, i) => (
                  <li key={i} className="submenu-item">
                    <Link to={child.link} className="submenu-link text-white">
                      <i className={`bi ${child.icon} me-2`}></i> {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
