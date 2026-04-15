import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, Play } from 'lucide-react';

export function InteractiveTrainerDeck({ trainers, themeColor }) {
  const [activeTrainer, setActiveTrainer] = useState(null);
  const modalRef = useRef(null);
  const deckRef = useRef(null);

  // Animate cards staggering in when trainers change
  useEffect(() => {
    if (deckRef.current) {
      gsap.fromTo(deckRef.current.children, 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [trainers]);

  // Modal full screen animation
  useEffect(() => {
    if (activeTrainer && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { autoAlpha: 0, scale: 0.95 }, 
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [activeTrainer]);

  const closeProfile = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        autoAlpha: 0, scale: 0.95, duration: 0.3, ease: 'power2.in',
        onComplete: () => setActiveTrainer(null)
      });
    }
  };

  return (
    <>
      <div className="trainer-deck" ref={deckRef}>
        {trainers.map((trainer) => (
          <div 
            key={trainer.id} 
            className="trainer-card group"
            onClick={() => setActiveTrainer(trainer)}
            style={{ '--theme-color': themeColor }}
          >
            <div className="card-image-wrapper">
              <img src={trainer.image} alt={trainer.name} className="trainer-img" />
              {/* Virtual Hover State / Video Placeholder via CSS icon */}
              <div className="card-hover-overlay">
                <Play className="play-icon" size={32} />
                <span className="preview-text">Preview Profile</span>
              </div>
            </div>
            
            <div className="card-info">
              <h3 className="trainer-name">{trainer.name}</h3>
              <p className="trainer-role">{trainer.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Profile Overlay */}
      {activeTrainer && (
        <div className="trainer-profile-modal" ref={modalRef}>
          <div className="modal-bg-overlay" onClick={closeProfile} />
          
          <div className="modal-content">
            <button className="close-btn" onClick={closeProfile}>
              <X size={32} />
            </button>
            
            <div className="modal-split">
              <div className="modal-image-col">
                <img src={activeTrainer.image} alt={activeTrainer.name} />
              </div>
              <div className="modal-info-col">
                <p className="modal-role" style={{ color: themeColor }}>{activeTrainer.role}</p>
                <h2 className="modal-name">{activeTrainer.name}</h2>
                <div className="stats-grid">
                  <div className="stat"><span>Experience</span> 10+ Yrs</div>
                  <div className="stat"><span>Clients</span> 500+</div>
                  <div className="stat"><span>Focus</span> Strength</div>
                </div>
                <p className="bio">
                  {activeTrainer.name} brings devastating intensity paired with deep biomechanical 
                  knowledge. Prepare to shatter ceilings and redefine what you consider heavy. 
                </p>
                <button className="book-btn" style={{ '--hover-color': themeColor }}>
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
