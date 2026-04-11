import React from "react";
import "./ScanProgressModal.css";
import ScanStepper from "./ScanStepper";

const ScanProgressModal = ({ open, steps, onClose }) => {
  if (!open) return null;

  return (
    <div className="scan-modal-overlay">
      <div className="scan-modal">
        <h2>Running Security Scans...</h2>
        <ScanStepper steps={steps} />
        {steps.every((s) => s.done) && (
          <div className="scan-complete">All scans complete!</div>
        )}
        <button onClick={onClose} disabled={!steps.every((s) => s.done)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ScanProgressModal;
