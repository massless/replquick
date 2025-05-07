import { useEffect } from "react";
import "./WelcomeModal.css";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h1 className="modal-title">
          <img src="/logo.svg" alt="Replquick Logo" className="modal-logo" />
          <img src="/wordmark.svg" alt="Replquick" className="modal-wordmark" />
        </h1>
        <p className="modal-slogan">A quick JavaScript playground</p>

        <div className="modal-body">
          <ul>
            <li>✨ Write and evaluate JavaScript code instantly</li>
            <li>💾 Debug, save and revisit your code history anytime</li>
          </ul>
        </div>

        <button className="modal-button" onClick={onClose}>
          ⚡ Code it
        </button>
      </div>
    </div>
  );
};
