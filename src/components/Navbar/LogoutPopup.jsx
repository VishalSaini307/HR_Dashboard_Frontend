import React from 'react';
import './LogoutPopup.css';

const LogoutPopup = ({ open, onCancel, onLogout }) => {
  if (!open) return null;
  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup-container">
        <div className="logout-popup-header">Log Out</div>
        <div className="logout-popup-body">
          <p>Are you sure you want to log out?</p>
          <div className="logout-popup-actions">
            <button className="logout-popup-cancel" onClick={onCancel}>Cancel</button>
            <button className="logout-popup-logout" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
