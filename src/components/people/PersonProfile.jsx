import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PEOPLE_DATA, ERA_META } from '../../data/peopleData';
import { useTranslation } from '../../i18n/LangContext';
import './PersonProfile.css';
export default function PersonProfile({ personId }) {
  const navigate = useNavigate();
  const { lang } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const person = PEOPLE_DATA.find(p => p.id === personId);
  const meta = person ? (ERA_META[person.era] || ERA_META.Revolution) : null;
  const isRTL = lang === 'ar';

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  if (!person) return <div className="loading-screen">Character Not Found</div>;

  const togglePlay = () => {
    if (!person.audio) return;
    if (!audioRef.current) audioRef.current = new Audio(person.audio);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="profile-page-wrapper" style={{ 
      '--era-color': meta.color,
      direction: isRTL ? 'rtl' : 'ltr' 
    }}>
      
      <div className="bg-glow-orb" />

      <nav className="profile-nav">
        <button onClick={() => navigate('/people')} className="glass-btn back-btn">
          <span>{isRTL ? '→' : '←'}</span>
        </button>
        <div className="era-indicator-pill">
           <span className="dot" /> {person.era}
        </div>
      </nav>

      <div className="profile-container">
        
        <div className="luxury-card">
          
          <div className="visual-section">
            <div className="portrait-frame">
               <div className="inner-glow" />
               {person.image ? (
                 <img src={person.image} alt={person.name[lang]} className="portrait-img" />
               ) : (
                 <span className="portrait-emoji">{person.icon}</span>
               )}
            </div>
          </div>

          <div className="info-section">
            <header className="hero-text">
              <h1 className="display-name">{person.name[lang]}</h1>
              {lang !== 'ar' && <h2 className="arabic-sub">{person.name.ar}</h2>}
            </header>

            <div className="timeline-badge">
              <span className="years">{person.born} — {person.died}</span>
              <span className="location">Algeria</span>
            </div>

            <div className="bio-container glass-panel">
               <p className="bio-text">{person.bio[lang]}</p>
            </div>
            <div className="audio-dock glass-panel">
               <button onClick={togglePlay} className="play-ring">
                 <div className={`ripple ${isPlaying ? 'active' : ''}`} />
                 {isPlaying ? '⏸' : '▶'}
               </button>
               <div className="audio-info">
                 <p className="label">{lang === 'ar' ? 'البصمة الصوتية' : 'AUDIO STORY'}</p>
                 <div className="wave-container">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`wave-bar ${isPlaying ? 'anim' : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                 </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}