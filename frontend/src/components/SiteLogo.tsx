"use client";

import React from 'react';

interface SiteLogoProps {
  className?: string;
  animated?: boolean;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ className = "w-10 h-10", animated = true }) => {
  return (
    <div className={className}>
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            .flow-line {
              fill: none;
              stroke-width: 8;
              stroke-linecap: round;
              stroke-dasharray: 40 60;
              ${animated ? 'animation: stream 2s linear infinite;' : ''}
            }

            .cyan-line { stroke: #00e5ff; filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.4)); }
            .grey-line { stroke: #4a4a4a; animation-delay: -0.5s; }
            .white-line { stroke: #ffffff; animation-delay: -1s; opacity: 0.8; }

            @keyframes stream {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            .arrow-head { fill: #00e5ff; filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.6)); }
          `}
        </style>

        {/* Triple Flow Paths */}
        <path className="flow-line white-line" d="M10 70 Q 30 70, 50 40" />
        <path className="flow-line grey-line" d="M10 50 Q 30 50, 60 30" />
        <path className="flow-line cyan-line" d="M10 30 Q 30 30, 70 20" />
        
        {/* Animated Arrow Head */}
        <path className="arrow-head" d="M75 10 L95 20 L75 30 Z" />
      </svg>
    </div>
  );
};
