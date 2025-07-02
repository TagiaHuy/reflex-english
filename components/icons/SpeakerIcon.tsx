import React from 'react';

interface IconProps {
  className?: string;
}

const SpeakerIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8.736 8.043a.5.5 0 0 1 .648-.465l3.41 1.278a.5.5 0 0 1 0 .93l-3.41 1.278a.5.5 0 0 1-.648-.465V8.043Z" />
    <path d="M2.75 12.5a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3Z" />
    <path
      fillRule="evenodd"
      d="M10.153 3.53a.5.5 0 0 1 .61.087l6 5a.5.5 0 0 1 0 .83l-6 5a.5.5 0 0 1-.61.087.5.5 0 0 1-.303-.497V4.027a.5.5 0 0 1 .303-.497ZM10.5 5.17v9.704l4.853-4.044a1.5 1.5 0 0 0 0-2.492L10.5 5.17Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SpeakerIcon;
