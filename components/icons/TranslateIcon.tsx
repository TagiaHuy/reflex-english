import React from 'react';

interface IconProps {
  className?: string;
}

const TranslateIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M12.87 15.07c.15.32.31.62.5.93h-2.74v-2h1.24c.33.36.67.7 1 .97zm7.13-2.07h-2.17c-.14-.34-.29-.67-.46-1h2.63a1 1 0 0 0 0-2h-3.08V8a1 1 0 0 0-1-1h-2V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7.26c.41.73.93 1.41 1.54 2H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v2h2a3 3 0 0 1 3 3v2a3 3 0 0 1-2.13 2.87zM7.5 7a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2h-5zm0 4a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2h-2zm10.5 7.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-2.5-2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zm2.5-2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zm-2.5 2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/>
  </svg>
);

export default TranslateIcon; 