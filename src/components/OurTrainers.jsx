import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Award, Activity, UserCheck } from 'lucide-react';
import './OurTrainers.css';

export function OurTrainers({ themeColor }) {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const trainers = [
    {
        id: 1,
        name: "Aman Verma",
        role: "Strength & Conditioning Coach",
        experience: "5+ Years",
        specialization: "Muscle Gain | Fat Loss | Functional Training",
        bio: "Helping clients break limits and build confidence through structured training.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
        about: "Certified trainer with expertise in strength training and body transformation.",
        skills: ["Weight Training", "HIIT", "Diet Planning"],
        achievements: ["Trained 200+ clients", "State-level fitness competitor"]
    },
    {
        id: 2,
        name: "Vikram Rajput",
        role: "Hypertrophy Expert",
        experience: "7+ Years",
        specialization: "Bodybuilding | Contest Prep | Nutrition",
        bio: "Building aesthetic and strong physiques with science-based protocols.",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80",
        about: "Specialized in bodybuilding and precise macronutrient coaching.",
        skills: ["Hypertrophy", "Macronutrient Planning", "Biomechanics"],
        achievements: ["National Powerlifting Champion", "Trained 300+ clients"]
    },
    {
        id: 3,
        name: "Priya Desai",
        role: "Functional & Mobility Coach",
        experience: "4+ Years",
        specialization: "Flexibility | Core Strength | CrossFit",
        bio: "Enhancing movement quality and athleticism for everyday life.",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80",
        about: "Dedicated to helping you move better and live pain-free through dynamic mobility.",
        skills: ["CrossFit", "Mobility Drills", "Core Conditioning"],
        achievements: ["Certified CrossFit L2", "Rehab Specialist"]
    },
    {
        id: 4,
        name: "Karan Singh",
        role: "Endurance & Cardio Specialist",
        experience: "6+ Years",
        specialization: "Marathon Prep | Athletics | Fat Loss",
        bio: "Pushing your cardiovascular limits to unlock peak endurance.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80",
        about: "Expert in athletic conditioning and high-performance cardiovascular training.",
        skills: ["Sprint Training", "VO2 Max Optimization", "Agility"],
        achievements: ["Completed 10+ Ironmans", "Trained Elite Athletes"]
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(headingRef.current.children, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
    }, containerRef);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="trainers-page" ref={containerRef}>
      
      {/* Header Section */}
      <div className="trainers-header animate-on-scroll" ref={headingRef}>
        <h1 className="t-heading">Meet Our <span style={{ color: themeColor }}>Trainers</span></h1>
        <h3 className="t-subheading">Guided by experts. Driven by results.</h3>
        <p className="t-intro">
          At Hercules Fitness, our trainers are more than just coaches — they are mentors who guide, motivate, and push you to become your best version. <br/><br/>
          With years of experience and a passion for fitness, our team is here to support you at every step of your journey.
        </p>
      </div>

      {/* Trust Builder Highlight Strip */}
      <div className="highlight-strip animate-on-scroll" style={{ '--strip-glow': themeColor }}>
        <h2>500+ Transformations. <span className="dot">•</span> 10+ Expert Trainers. <span className="dot">•</span> One Goal — <span>Your Growth.</span></h2>
      </div>

      {/* Trainers Grid */}
      <div className="trainers-grid">
        {trainers.map((trainer, idx) => (
            <div 
              key={trainer.id} 
              className="trainer-card-pro animate-on-scroll" 
              style={{ transitionDelay: `${idx * 0.15}s`, '--theme-color': themeColor }}
            >
              <div className="tc-image-container">
                  <img src={trainer.image} alt={trainer.name} className="tc-image" />
                  <div className="tc-overlay">
                      <div className="tc-buttons">
                          <button className="tc-btn outline" onClick={() => setSelectedTrainer(trainer)}>
                              View Profile
                          </button>
                          <button className="tc-btn filled" style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                              Book Session
                          </button>
                      </div>
                  </div>
              </div>
              <div className="tc-info">
                  <h3 className="tc-name">{trainer.name}</h3>
                  <p className="tc-role" style={{ color: themeColor }}>{trainer.role}</p>
                  
                  <div className="tc-meta">
                      <span><strong>Exp:</strong> {trainer.experience}</span>
                  </div>
                  
                  <p className="tc-spec"><strong>Specialization:</strong> {trainer.specialization}</p>
                  
                  <p className="tc-bio">{trainer.bio}</p>
              </div>
            </div>
        ))}
      </div>

      {/* Trainer Profile Modal */}
      {selectedTrainer && (
        <div className="t-modal-overlay">
          <div className="t-modal-content" style={{ '--theme-color': themeColor }}>
            <button className="close-t-modal" onClick={() => setSelectedTrainer(null)}>
              <X size={28} />
            </button>
            
            <div className="t-modal-split">
                <div className="t-modal-img">
                    <img src={selectedTrainer.image} alt={selectedTrainer.name} />
                </div>
                
                <div className="t-modal-details">
                    <h2 className="tm-name">{selectedTrainer.name}</h2>
                    <h4 className="tm-role" style={{ color: themeColor }}>{selectedTrainer.role}</h4>
                    
                    <div className="tm-section">
                        <h3>About</h3>
                        <p>{selectedTrainer.about}</p>
                    </div>

                    <div className="tm-section">
                        <h3><Activity size={18}/> Skills</h3>
                        <ul className="tm-list">
                            {selectedTrainer.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                        </ul>
                    </div>

                    <div className="tm-section">
                        <h3><Award size={18}/> Achievements</h3>
                        <ul className="tm-list">
                            {selectedTrainer.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                        </ul>
                    </div>

                    <button className="tm-book-btn" style={{ backgroundColor: themeColor }}>
                        👉 Book a Session
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
