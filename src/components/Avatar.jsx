import { forwardRef } from 'react';

// Using forwardRef so App.jsx GSAP can animate the internal paths and filters
export const Avatar = forwardRef((props, ref) => {
  return (
    <div className="avatar-container" ref={ref}>
      <svg 
        className="avatar-svg" 
        viewBox="0 0 200 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="muscleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" className="glow-stop-0" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" className="glow-stop-1" />
          </radialGradient>
        </defs>

        {/* Base Body - Starts thin/slouched, will be morphed via GSAP to muscular/upright */}
        <path 
          id="bodyPath"
          className="body-path"
          d="M70,80 C60,150 40,250 80,380 L120,380 C160,250 140,150 130,80 C140,40 120,10 100,10 C80,10 60,40 70,80 Z" 
          fill="#333" 
          stroke="var(--color-text)"
          strokeWidth="2"
        />

        {/* Sweat/Aura particles (hidden initially) */}
        <g id="sweatGroup" opacity="0">
          <circle cx="60" cy="100" r="2" fill="#fff" className="sweat-drop" />
          <circle cx="140" cy="120" r="3" fill="#fff" className="sweat-drop" />
          <circle cx="50" cy="200" r="2" fill="#fff" className="sweat-drop" />
          <circle cx="150" cy="180" r="2.5" fill="#fff" className="sweat-drop" />
        </g>

        {/* Transforming Glow to represent power/consistency output */}
        <circle 
          id="powerAura"
          cx="100" 
          cy="150" 
          r="80" 
          fill="url(#muscleGlow)" 
        />
      </svg>
    </div>
  );
});
