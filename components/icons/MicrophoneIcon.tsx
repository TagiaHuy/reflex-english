import React from 'react';

interface IconProps {
  className?: string;
}

const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-14 0 1 1 0 1 1 2 0 5 5 0 0 0 10 0zM11 19h2v2a1 1 0 1 1-2 0v-2z" />
  </svg>
);

export default MicrophoneIcon;
