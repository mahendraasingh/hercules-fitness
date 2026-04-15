import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { slidesData } from './data/slidesData';
import { TrainingPanel } from './components/TrainingPanel';
import { InteractiveTrainerDeck } from './components/InteractiveTrainerDeck';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WhyChooseHercules } from './components/WhyChooseHercules';
import { Careers } from './components/Careers';
import { OurTrainers } from './components/OurTrainers';
import { FindGym } from './components/FindGym';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeView, setActiveView] = useState('home');
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const slideRef = useRef(null);

  const currentSlide = slidesData[currentIndex];

  const changeSlide = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % slidesData.length
      : (currentIndex - 1 + slidesData.length) % slidesData.length;

    const timeline = gsap.timeline();

    // The whole screen "shifts" panel animation (Swipe out, Zoom out slightly, fade)
    timeline.to(slideRef.current, {
      x: direction === 'next' ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        // Change state mid-transition when invisible
        setCurrentIndex(newIndex);
      }
    });

    // Background transition (crossfade via pseudo-elements ideally, or just fade)
    // We can swap the background image and fade it back in.
    timeline.to(bgRef.current, { opacity: 0.5, duration: 0.4 }, 0);

  };

  // Animate in the new slide
  useEffect(() => {
    const timeline = gsap.timeline();
    timeline.to(bgRef.current, { opacity: 1, duration: 0.6 }, 0);
    timeline.fromTo(slideRef.current, 
      { x: -50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      0
    );
  }, [currentIndex]);

  return (
    <div className="app-container app-panel-layout" ref={containerRef}>
      
      {/* Dynamic Background */}
      <div 
        className="panel-background bg-transition" 
        ref={bgRef}
        style={{ backgroundImage: `url('${currentSlide.bgImage}')` }}
      />
      
      {/* Top Navbar / Header area */}
      <nav className="global-nav">
        <div className="brand" style={{ color: currentSlide.themeColor }}>
          HERCULES
        </div>
        <ul className="nav-links" style={{ marginLeft: 'auto' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'our-trainers', label: 'Our Trainers' },
            { id: 'why-choose', label: 'Why Choose Hercules?' },
            { id: 'careers', label: 'Careers' },
            { id: 'find-gym', label: 'Find a Gym' }
          ].map((item) => (
            <li 
              key={item.id} 
              className={activeView === item.id ? 'active' : ''}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
              {activeView === item.id && (
                <div className="nav-indicator" style={{ backgroundColor: currentSlide.themeColor || '#4ade80' }} />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Slide Content Split */}
      {activeView === 'home' && (
      <>
      <main className="slide-content" ref={slideRef}>
        <div className="layout-split">
          <div className="left-panel">
            <TrainingPanel data={currentSlide} />
          </div>
          
          <div className="right-panel">
            <InteractiveTrainerDeck 
              trainers={currentSlide.trainers} 
              themeColor={currentSlide.themeColor} 
            />
          </div>
        </div>
      </main>

      {/* Bottom Navigation HUD */}
      <footer className="panel-navigation">
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => changeSlide('prev')}>
            <ChevronLeft size={24} />
          </button>
          <button className="nav-btn" onClick={() => changeSlide('next')}>
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="slide-indicator">
          <span className="current" style={{ color: currentSlide.themeColor }}>
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="separator" />
          <span className="total">
            {String(slidesData.length).padStart(2, '0')}
          </span>
        </div>
      </footer>
      </>
      )}

      {activeView === 'why-choose' && (
        <WhyChooseHercules themeColor={currentSlide.themeColor} />
      )}

      {activeView === 'careers' && (
        <Careers themeColor={currentSlide.themeColor} />
      )}

      {activeView === 'our-trainers' && (
        <OurTrainers themeColor={currentSlide.themeColor} />
      )}

      {activeView === 'find-gym' && (
        <FindGym themeColor={currentSlide.themeColor} />
      )}

    </div>
  );
}

export default App;
