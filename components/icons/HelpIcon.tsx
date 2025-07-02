import React from 'react';

interface IconProps {
  className?: string;
}

const HelpIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 13a2 2 0 1 0-2-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 15v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default HelpIcon;
