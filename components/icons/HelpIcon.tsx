import React from 'react';

interface IconProps {
  className?: string;
}

const HelpIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.882 0-1.473.823-1.473 1.823v.098c0 .3.234.533.533.533h.005c.299 0 .533-.234.533-.533v-.098c0-.593.254-1.018.935-1.018.71 0 1.21.578 1.21 1.313 0 .618-.315.992-.857 1.432-.542.44-1.234 1.055-1.234 2.03v.101c0 .3.234.533.533.533h.005c.299 0 .533-.234.533-.533v-.101c0-.68.42-1.152 1.018-1.638.598-.485 1.412-1.12 1.412-2.315 0-1.423-1.246-2.5-2.923-2.5ZM12 15.75a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Z" clipRule="evenodd" />
    </svg>
);

export default HelpIcon;
