import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20',
    secondary: 'bg-surface/10 hover:bg-surface/20 text-primary border border-border/20 backdrop-blur-md',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-white',
    ghost: 'hover:bg-surface text-primary/70 hover:text-primary',
    white: 'bg-white text-black hover:bg-white/90',
    theme: 'bg-surface border border-border text-primary hover:bg-muted/10',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
