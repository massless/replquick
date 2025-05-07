import React from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="setting-item">
            <label htmlFor="darkMode">Dark Mode</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="darkMode"
                checked={isDarkMode}
                onChange={onToggleDarkMode}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};