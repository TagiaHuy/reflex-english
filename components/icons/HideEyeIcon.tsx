import React from 'react';

interface IconProps {
  className?: string;
}

const HideEyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.97 10.97 0 0112 19.5c-6.5 0-10.5-7.5-10.5-7.5a21.77 21.77 0 014.21-5.94M6.06 6.06A10.97 10.97 0 0112 4.5c6.5 0 10.5 7.5 10.5 7.5a21.77 21.77 0 01-4.21 5.94M1 1l22 22" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default HideEyeIcon; 