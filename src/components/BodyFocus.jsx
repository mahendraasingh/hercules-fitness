import { forwardRef } from 'react';

export const BodyFocus = forwardRef((props, ref) => {
  return (
    <div className="body-svg-container" ref={ref}>
      <svg 
        viewBox="0 0 200 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}
      >
        <defs>
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Body - Outline */}
        <g stroke="#333" strokeWidth="2" fill="rgba(0,0,0,0.5)">
          {/* Head & Neck */}
          <path d="M85,50 C85,30 115,30 115,50 C115,70 105,75 105,80 L95,80 C95,75 85,70 85,50 Z" />
          
          {/* Arms (Left & Right) */}
          <path id="arm-left" className="body-part" d="M70,90 C40,110 30,180 35,220 C40,225 50,220 50,180 C50,150 65,110 75,100 Z" />
          <path id="arm-right" className="body-part" d="M130,90 C160,110 170,180 165,220 C160,225 150,220 150,180 C150,150 135,110 125,100 Z" />
          
          {/* Chest & Torso */}
          <path id="chest" className="body-part" d="M70,90 L130,90 C140,120 130,180 115,220 L85,220 C70,180 60,120 70,90 Z" />
          
          {/* Legs (Left & Right) */}
          <path id="leg-left" className="body-part" d="M85,220 C70,300 70,400 75,450 C85,450 95,400 95,300 C95,250 100,220 100,220 Z" />
          <path id="leg-right" className="body-part" d="M115,220 C130,300 130,400 125,450 C115,450 105,400 105,300 C105,250 100,220 100,220 Z" />
        </g>
      </svg>
    </div>
  );
});
