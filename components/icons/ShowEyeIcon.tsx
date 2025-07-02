import React from 'react';

interface IconProps {
  className?: string;
}

const ShowEyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default ShowEyeIcon; 