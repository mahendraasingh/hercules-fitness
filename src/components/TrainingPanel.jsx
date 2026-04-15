import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function TrainingPanel({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Powerful, visceral text animation upon panel render
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim-text', 
        { y: 150, opacity: 0, scale: 0.8 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
      );
      
      gsap.fromTo('.anim-sub',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: 'power2.out' }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [data.id]); // Re-animate if data id changes

  return (
    <div className="training-panel" ref={containerRef}>
      <div className="panel-content">
        <h1 className="panel-title">
          <div className="title-row anim-text">{data.title1}</div>
          <div className="title-row anim-text highlight" style={{ color: data.themeColor }}>
            {data.title2}
          </div>
        </h1>
        
        <p className="panel-subtitle anim-sub">
          {data.subtitle}
        </p>

        <button className="cta-button anim-sub" style={{ '--theme-color': data.themeColor }}>
          Explore {data.mode} Mode
        </button>
      </div>
    </div>
  );
}
