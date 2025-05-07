import { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsMobile } from "../hooks/useIsMobile";
import "./WelcomeModal.css";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const isMobile = useIsMobile();

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
          <div className="debug-view">
            <SyntaxHighlighter
              language="json"
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: "4px",
                padding: "1rem",
              }}
            >
              {JSON.stringify(
                {
                  write: isMobile
                    ? `Evaluate JS`
                    : "console.log('Evaluate JavaScript code instantly.')",
                  rewrite: isMobile
                    ? `Debug + save`
                    : "console.log('Debug, save and revisit your code history anytime.')",
                },
                null,
                2
              )}
            </SyntaxHighlighter>
          </div>
        </div>

        <button className="modal-button" onClick={onClose}>
          ⚡ Code it
        </button>
      </div>
    </div>
  );
};
