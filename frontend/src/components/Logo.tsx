import React from 'react';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#2979FF" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Profile Head Silhouette */}
      <path 
        d="M30 30 C 30 15, 60 15, 65 35 C 70 55, 55 75, 45 80 C 40 85, 30 85, 30 85 L 30 30 Z" 
        fill="url(#logoGradient)" 
        opacity="0.9"
        filter="url(#glow)"
      />
      
      {/* Flowing Lines */}
      <path 
        d="M40 45 Q 60 45, 80 40" 
        stroke="url(#logoGradient)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        opacity="0.8" 
      />
      <path 
        d="M42 55 Q 65 55, 85 50" 
        stroke="url(#logoGradient)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        opacity="0.6" 
      />
      <path 
        d="M44 65 Q 70 65, 90 60" 
        stroke="url(#logoGradient)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        opacity="0.4" 
      />
    </svg>
  );
};
