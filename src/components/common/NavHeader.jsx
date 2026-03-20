// src/components/common/NavHeader.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth }        from '../../context/AuthContext';
import { useTheme }       from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/LangContext';
import { useState }       from 'react';

export default function NavHeader() {
  const { currentUser, isGuest, logout } = useAuth();
  const { isDark, toggleTheme }          = useTheme();
  const { t, lang, switchLang }          = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to:'/',         label:t('nav.home'),     emoji:'🏠' },
    { to:'/timeline', label:t('nav.timeline'), emoji:'⏳' },
    { to:'/people',   label:t('nav.people'),   emoji:'🦸' },
    { to:'/games',    label:t('nav.games'),    emoji:'🎮' },
    { to:'/facts',    label:t('nav.facts'),    emoji:'📊' },
    { to:'/gallery',  label:t('nav.gallery'),  emoji:'🖼️' },
  ];

  return (
    <header className="nav-header">
      {/* Logo */}
      <NavLink to="/" className="nav-logo">
        <span style={{fontSize:'1.8rem', animation:'float 3s ease-in-out infinite'}}>🇩🇿</span>
        <span>Algeria Quest</span>
      </NavLink>

      {/* Nav links — desktop */}
      <nav>
        <ul className="nav-links">
          {links.map(({to, label, emoji}) => (
            <li key={to}>
              <NavLink to={to} end={to==='/'} className={({isActive})=>`nav-link${isActive?' active':''}`}>
                {emoji} {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Controls */}
      <div className="nav-controls">
        {/* Lang */}
        <div style={{display:'flex', gap:'3px'}}>
          {['en','ar','fr'].map(l=>(
            <button key={l} className={`lang-btn${lang===l?' active':''}`} onClick={()=>switchLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>

        {/* Theme toggle */}
        <button className={`theme-toggle${isDark?' dark-on':''}`} onClick={toggleTheme} title="Toggle theme">
          <div className="theme-toggle-thumb">{isDark?'🌙':'☀️'}</div>
        </button>

        {/* Auth */}
        {isGuest ? (
          <>
            <NavLink to="/login" className="nav-link">🔑 {t('nav.login')}</NavLink>
            <button className="btn btn-green btn-sm" onClick={()=>navigate('/signup')}>✨ {t('nav.signup')}</button>
          </>
        ) : (
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{
              background:'var(--green-bg)', border:'2px solid var(--green-light)',
              borderRadius:'var(--r-pill)', padding:'5px 14px',
              fontSize:'0.85rem', fontWeight:800, color:'var(--green)',
            }}>
              😊 {currentUser.username}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>{logout();navigate('/');}}>
              👋 {t('nav.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
