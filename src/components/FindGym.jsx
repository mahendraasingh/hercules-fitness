import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, MapPin } from 'lucide-react';
import { EarthAnimation } from './EarthAnimation';

export const FindGym = ({ themeColor = '#3b82f6' }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="find-gym-view">
      <EarthAnimation themeColor={themeColor} />
      <div className="globe-overlay" />

      <div className="find-gym-content" ref={containerRef}>
        <h1 className="find-gym-title">FIND YOUR ARENA</h1>
        <p className="find-gym-subtitle">Locate a Hercules Fitness center near you and step into greatness.</p>
        
        <div className="search-bar-glass">
          <MapPin className="search-icon" size={24} style={{ color: themeColor }} />
          <input 
            type="text" 
            placeholder="Enter city, state, or zip code..." 
            className="search-input"
          />
          <button className="search-submit" style={{ backgroundColor: themeColor }}>
            <Search size={20} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
};
