"use client";

import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, title }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-100 flex justify-center items-center z-50 backdrop-blur-sm">
      {/* Inner modal content area */}
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 relative w-11/12 md:w-1/2 lg:w-1/3 shadow-xl transform transition-all duration-300 scale-100"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        {/* Children content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
