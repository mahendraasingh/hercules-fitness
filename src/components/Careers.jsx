import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, TrendingUp, Users, Heart, Award, X, Target } from 'lucide-react';
import './Careers.css';

export function Careers({ themeColor }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(".hero-content > *", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }, containerRef);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElements.forEach(el => observer.observe(el));

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  const whyWorkCards = [
    { icon: <TrendingUp size={32} />, title: 'Growth Opportunities', desc: 'Continuous learning and career advancement.' },
    { icon: <Users size={32} />, title: 'Supportive Team', desc: 'A collaborative and driven community.' },
    { icon: <Heart size={32} />, title: 'Free Gym Access', desc: 'Stay fit with 24/7 access to our premium facilities.' },
    { icon: <Target size={32} />, title: 'Career Development', desc: 'Mentorship and leadership programs.' },
  ];

  const jobs = [
    { id: 1, title: 'Fitness Trainer', desc: 'Expert in high-intensity training and personal coaching.', reqs: ['CPT Certified', '2+ years experience', 'High energy'] },
    { id: 2, title: 'Nutrition Coach', desc: 'Help members build sustainable eating habits.', reqs: ['B.S. in Nutrition', 'Dietitian preferred', 'Empathy'] },
    { id: 3, title: 'Front Desk Executive', desc: 'The welcoming face of Hercules Fitness.', reqs: ['Excellent communication', 'Organized', 'Customer-first approach'] },
    { id: 4, title: 'Social Media Manager', desc: 'Build the Hercules brand online.', reqs: ['Content creation', 'Photography/Videography', 'Creative mindset'] },
  ];

  const handleApplyClick = (e) => {
    e.preventDefault();
    document.getElementById('application-form-section').scrollIntoView({ behavior: 'smooth' });
    if(selectedJob) setSelectedJob(null);
  }

  return (
    <div className="careers-page" ref={containerRef}>
      
      {/* 1. Hero Section */}
      <section className="careers-hero" ref={heroRef}>
        <div className="hero-bg-zoom"></div>
        <div className="hero-content">
          <h1 className="careers-heading">Build Your Future With <span style={{color: themeColor}}>Hercules</span></h1>
          <p className="careers-subtext">Join a team that lives strength, discipline, and growth.</p>
          <div className="hero-buttons">
            <button className="primary-btn apply-btn" onClick={() => document.getElementById('application-form-section').scrollIntoView({ behavior: 'smooth' })}>
              Apply Now
            </button>
            <button className="secondary-btn view-roles-btn" onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}>
              View Open Roles
            </button>
          </div>
        </div>
      </section>

      {/* 2. Why Work With Us */}
      <section className="why-work-section animate-on-scroll">
        <h2 className="section-title">Why Work With Us</h2>
        <div className="why-work-grid">
          {whyWorkCards.map((card, idx) => (
            <div key={idx} className="why-card glass-card fade-in-up" style={{transitionDelay: `${idx * 0.15}s`, '--theme-color': themeColor}}>
              <div className="card-icon" style={{color: themeColor}}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Culture */}
      <section className="culture-section animate-on-scroll">
        <div className="culture-split">
          <div className="culture-image slide-in-left">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"
              alt="Hercules Culture" 
              className="culture-real-img"
              style={{ borderColor: themeColor }}
            />
          </div>
          <div className="culture-text slide-in-right">
            <h2 className="section-title text-left">Our Culture</h2>
            <p className="culture-desc">
              At Hercules, we believe in pushing limits together.<br/><br/>
              We celebrate discipline, consistency, and results — not just for our members, but for our team as well.
            </p>
            <div className="culture-stats">
              <div className="stat-item" style={{'--theme-color': themeColor}}>
                <h4>500+</h4>
                <p>Members Trained</p>
              </div>
              <div className="stat-item" style={{'--theme-color': themeColor}}>
                <h4>10+</h4>
                <p>Expert Coaches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Open Positions */}
      <section id="open-positions" className="open-positions-section animate-on-scroll">
        <h2 className="section-title">Open Positions</h2>
        <div className="jobs-grid">
          {jobs.map((job, idx) => (
            <div key={job.id} className="job-card fade-in-up" style={{transitionDelay: `${idx * 0.1}s`, '--theme-color': themeColor}}>
              <div className="job-content">
                <h3>{job.title}</h3>
                <p>{job.desc}</p>
              </div>
              <button className="apply-trigger-btn" style={{color: themeColor}} onClick={() => setSelectedJob(job)}>
                Details <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Application Form Section */}
      <section id="application-form-section" className="application-section animate-on-scroll">
        <div className="application-container glass-card">
          <h2 className="section-title" style={{marginBottom: '2rem'}}>Join The Team</h2>
          <form className="application-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Full Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Phone Number" required />
            </div>
            <div className="form-group">
              <select required defaultValue="">
                <option value="" disabled>Select Role</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>
            <div className="form-group file-group">
              <label>Upload Resume</label>
              <input type="file" accept=".pdf,.doc,.docx" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Tell us why you belong at Hercules..." rows="4" required></textarea>
            </div>
            <button type="submit" className="submit-btn" style={{backgroundColor: themeColor}}>
              🔥 Submit Application
            </button>
          </form>
        </div>
      </section>

      {/* 5. Job Details Popup */}
      {selectedJob && (
        <div className="job-modal-overlay">
          <div className="job-modal-content">
            <button className="close-modal" onClick={() => setSelectedJob(null)}>
              <X size={24} />
            </button>
            <h2>{selectedJob.title}</h2>
            <p className="job-modal-desc">{selectedJob.desc}</p>
            
            <div className="job-reqs">
              <h3>Requirements:</h3>
              <ul>
                {selectedJob.reqs.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </div>

            <button className="modal-apply-btn" style={{backgroundColor: themeColor}} onClick={handleApplyClick}>
              👉 Apply Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
