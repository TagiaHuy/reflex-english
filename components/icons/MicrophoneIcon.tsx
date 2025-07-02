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
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 5v6a1 1 0 0 1-2 0V5a1 1 0 1 1 2 0Zm4 0v6a1 1 0 1 1-2 0V5a1 1 0 1 1 2 0Z" />
    <path d="M12 18.5a5.5 5.5 0 0 1-5.5-5.5V12h1.47a.5.5 0 0 1 .5.5v.5a3.53 3.53 0 0 0 7.06 0v-.5a.5.5 0 0 1 .5-.5H17.5v1a5.5 5.5 0 0 1-5.5 5.5Z" />
  </svg>
);

export default MicrophoneIcon;
