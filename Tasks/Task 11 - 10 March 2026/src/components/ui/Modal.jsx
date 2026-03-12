import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, children, title, transparent = false }) => {
  // Lock body scroll when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl ${transparent ? 'p-0 md:p-8' : 'p-4 md:p-8'}`}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-4xl shadow-2xl transition-all duration-300 ${
              transparent 
                ? 'bg-transparent h-fit max-h-screen md:bg-surface md:rounded-2xl md:border md:border-white/10 overflow-hidden' 
                : 'bg-surface h-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header if title exists */}
            {title && (
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-display font-bold">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close Button (if no title header) */}
            {!title && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <div className="w-full h-full">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
