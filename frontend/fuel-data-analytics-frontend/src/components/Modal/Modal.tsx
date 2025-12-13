import React from "react";
import "./Modal.css";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="custom-modal-backdrop">
            <div className="custom-modal">
                <div className="modal-header position-relative text-center mt-3">
                    <h5 className="modal-title w-100">{title}</h5>

                    <button
                        className="btn-close position-absolute end-0 me-2"
                        onClick={onClose}
                    ></button>
                </div>

                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
