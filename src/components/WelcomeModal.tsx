import { useEffect } from 'react';
import './WelcomeModal.css';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Welcome to Replquick!</h2>
        <div className="modal-body">
          <p>Replquick is a JavaScript playground where you can:</p>
          <ul>
            <li>Write and evaluate JavaScript code in real-time</li>
            <li>See the results of your code execution instantly</li>
            <li>Debug your code with detailed execution information</li>
            <li>Save your code history for future reference</li>
          </ul>
          <p>To get started, simply:</p>
          <ol>
            <li>Enter JavaScript in the input area</li>
            <li>Click "Evaluate"</li>
            <li>View and debug the output</li>
          </ol>
        </div>
        <button className="modal-button" onClick={onClose}>
          Get Started
        </button>
      </div>
    </div>
  );
};