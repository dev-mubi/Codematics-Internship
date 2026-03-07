import React from "react";
import Modal from "./Modal";
import { LogOut } from "lucide-react";
import "./SignOutModal.css";

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} title="Sign Out" onClose={onClose}>
      <div className="sign-out-content">
        <div className="sign-out-icon-wrapper">
          <LogOut size={32} className="sign-out-icon" />
        </div>
        <p className="sign-out-text">
          Are you sure you want to sign out of Onyx Wealth?
        </p>
        <div className="sign-out-actions form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary danger-btn" onClick={onConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignOutModal;
