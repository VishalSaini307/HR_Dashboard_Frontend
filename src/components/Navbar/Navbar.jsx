import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import dashboardImage from '../../assets/dashboard.png';

import './Navbar.css';
import LogoutPopup from './LogoutPopup';

import CandidatesIcon from '../../assets/NavbarIcons/Icon1.png';
import EmployeesIcon from '../../assets/NavbarIcons/Icon2.png';
import AttendanceIcon from '../../assets/NavbarIcons/Icon3.png';
import LeavesIcon from '../../assets/NavbarIcons/Icon4.png';
import LogoutIcon from '../../assets/NavbarIcons/Icon.png';

export const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogout(true);
  };
  const handleCancel = () => setShowLogout(false);
  const handleLogout = () => {
    setShowLogout(false);
    // Redirect to login or perform logout logic here
    window.location.href = '/login';
  };

  return (
    <>
      <div className="navbar-sidebar">
        <div className="navbar-logo-section">
              <span className="logo-icon" style={{ fontSize: '32px' }}>🔲</span>
              <span className="navbar-logo-text">LOGO</span>
        </div>
        <div className="navbar-search-section">
          <input type="text" className="navbar-search" placeholder="Search" />
        </div>
        <div className="navbar-section navbar-section-recruitment">
          <div className="navbar-section-title navbar-section-title-muted">Recruitment</div>
          <NavLink to="/candidate" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}` }>
            <span className="navbar-link-icon"><img src={CandidatesIcon} alt="Candidates" /></span>
            Candidates
          </NavLink>
        </div>
        <div className="navbar-section navbar-section-organization">
          <div className="navbar-section-title navbar-section-title-muted">Organization</div>
          <NavLink to="/employees" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}` }>
            <span className="navbar-link-icon"><img src={EmployeesIcon} alt="Employees" /></span>
            Employees
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}` }>
            <span className="navbar-link-icon"><img src={AttendanceIcon} alt="Attendance" /></span>
            Attendance
          </NavLink>
          <NavLink to="/leaves" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}` }>
            <span className="navbar-link-icon"><img src={LeavesIcon} alt="Leaves" /></span>
            Leaves
          </NavLink>
        </div>
        <div className="navbar-section navbar-section-others">
          <div className="navbar-section-title navbar-section-title-muted">Others</div>
          <a href="/login" className="navbar-link" onClick={handleLogoutClick}>
            <span className="navbar-link-icon"><img src={LogoutIcon} alt="Logout" /></span>
            Logout
          </a>
        </div>
      </div>
      <LogoutPopup open={showLogout} onCancel={handleCancel} onLogout={handleLogout} />
    </>
  );
}
