import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  scanSuccessfullyContainer,
  documentSuccessfullyScannedText,
  documentSucccessfullyScannedText2,
  documentScanSuccessfullyContainer,
} from "./ScanSuccessfullyStyle";

const ScanSuccessfully = ({ trigger, setTrigger }) => {

  const navigate = useNavigate();

  // POP UP GO AWAY HAHA
  useEffect(() => {
    if (trigger) { // Check if the trigger is still true
      const timer = setTimeout(() => {
        setTrigger(false); // Close the pop-up
        navigate('/uploadpage');
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [trigger, setTrigger]);

  const handlePopUpContentClick = (event) => {
    event.stopPropagation();
  };

  return trigger ? (
    <div
      className="scan-successfully-overlay"
      style={scanSuccessfullyContainer}
      onClick={() => navigate('/uploadpage')}
    >
      <div
        className="scan-successfully-content"
        style={documentScanSuccessfullyContainer}
        onClick={handlePopUpContentClick}
      >
        <p name="success" style={documentSuccessfullyScannedText}>Document Successfully Scanned.</p>
        <p style={documentSucccessfullyScannedText2}>
          View Scanned Document in the Invoice & Statement of Account Page.
        </p>
      </div>
    </div>
  ) : null;
};

export default ScanSuccessfully;
