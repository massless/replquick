import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsMobile } from "../hooks/useIsMobile";
import "./WelcomeModal.css";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = (props: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (props.isOpen && !isOpen) {
      console.log("[WelcomeModal] isOpen");
      document.body.style.overflow = "hidden";
      setIsOpen(true);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [props.isOpen, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="welcome-modal-content"
        // onClick={(e) => e.stopPropagation()}
      >
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

        <header>
          <h1 className="modal-title">
            {/* <img src="/logo.svg" alt="Replquick Logo" className="modal-logo" /> */}
            <img
              src="/wordmark.svg"
              alt="Replquick"
              className="modal-wordmark"
            />
          </h1>
          <p className="modal-slogan">is a quick JavaScript playground</p>
        </header>

        <button
          className="modal-button"
          onClick={() => {
            console.log("[WelcomeModal] a thing", props.onClose);
            props.onClose();
          }}
        >
          ⚡ Code it
        </button>
      </div>
    </div>
  );
};
