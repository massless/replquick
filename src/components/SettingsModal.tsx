import React from "react";
import "./SettingsModal.css";

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
          <button className="close-button" onClick={onClose}>
            <svg
              fill="currentColor"
              strokeWidth="0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
            >
              <path
                fill-rule="evenodd"
                d="m7.116 8-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
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
