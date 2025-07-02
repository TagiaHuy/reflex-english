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
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
    <path d="M14.5 3.97v2.06c2.89.86 5 3.54 5 6.97s-2.11 6.11-5 6.97v2.06c4.01-.91 7-4.49 7-9.03s-2.99-8.12-7-9.03z" />
  </svg>
);

export default SpeakerIcon;
