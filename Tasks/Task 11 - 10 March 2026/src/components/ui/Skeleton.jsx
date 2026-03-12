import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 w-3/4',
  };

  return (
    <div className={`bg-border/30 animate-pulse ${variants[variant]} ${className}`}></div>
  );
};

export default Skeleton;
