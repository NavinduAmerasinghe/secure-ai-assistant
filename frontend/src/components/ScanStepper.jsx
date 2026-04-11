import React from "react";
import "./ScanStepper.css";

const ScanStepper = ({ steps }) => {
  return (
    <div className="scan-stepper">
      {steps.map((step, idx) => (
        <div className="scan-stepper-step" key={step.label}>
          <div className={`scan-stepper-circle${step.done ? " done" : ""}`}>{step.done ? "✔" : idx + 1}</div>
          <div className="scan-stepper-label">{step.label}</div>
          {idx < steps.length - 1 && <div className="scan-stepper-line" />}
        </div>
      ))}
    </div>
  );
};

export default ScanStepper;
