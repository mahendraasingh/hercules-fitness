import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Dumbbell, Flame, Zap, Salad, TrendingUp } from 'lucide-react';
import './WhyChooseHercules.css';

export function WhyChooseHercules({ themeColor }) {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in heading
      gsap.fromTo(headingRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      // Slide up cards one by one
      gsap.fromTo(cardsRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: <Dumbbell size={32} />, title: "Expert Trainers", desc: "Guidance from professionals who understand your body and your goals.", glow: "rgba(59, 130, 246, 0.5)" },
    { icon: <Flame size={32} />, title: "Result-Driven Programs", desc: "Workout plans tailored for real transformation, not guesswork.", glow: "rgba(239, 68, 68, 0.5)" },
    { icon: <Zap size={32} />, title: "High-Energy Environment", desc: "A space that pushes you to give your best every single day.", glow: "rgba(234, 179, 8, 0.5)" },
    { icon: <Salad size={32} />, title: "Fitness & Nutrition", desc: "Because real change happens both inside and outside the gym.", glow: "rgba(34, 197, 94, 0.5)" },
    { icon: <TrendingUp size={32} />, title: "Track Your Progress", desc: "Stay motivated by seeing how far you've come.", glow: "rgba(168, 85, 247, 0.5)" },
  ];

  return (
    <div className="why-choose-page" ref={containerRef}>
      <div className="dynamic-texture-bg"></div>
      
      <div className="why-content-wrapper">
        <div className="why-header" ref={headingRef}>
          <h2 className="why-title">Not just a gym. A place where discipline turns into <span style={{ color: themeColor }}>strength.</span></h2>
          <p className="why-subtitle">
            At Hercules Fitness, we don't just focus on workouts — we focus on transformation.
            Whether you're stepping into the gym for the first time or pushing past your limits, we create an environment that drives results. 
            <br/><br/>
            Our approach is simple: <strong>Train smarter. Stay consistent. Become stronger.</strong>
            <br/><br/>
            From expert trainers to a high-energy atmosphere, everything here is designed to keep you motivated and moving forward.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="feature-card glass-card"
              ref={el => cardsRef.current[idx] = el}
              style={{ '--hover-glow': feat.glow }}
            >
              <div className="feat-icon" style={{ color: themeColor }}>
                {feat.icon}
              </div>
              <h3 className="feat-title">{feat.title}</h3>
              <p className="feat-desc">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="why-footer">
          <p className="closing-line">You don't just join Hercules. <span>You become part of it.</span></p>
          <button className="join-glowing-btn" style={{ '--btn-glow': themeColor }}>
            JOIN NOW
          </button>
        </div>
      </div>
    </div>
  );
}
