// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="topnav">
      <ul>
        <li>
          <Link to="/"className="topnav-link">Home</Link>
        </li>
        <li>
          <Link to="/SetDetails" className="topnav-link">Patient</Link>
        </li>
        <li>
          <Link to="/setdoctor" className="topnav-link">Doctor</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
