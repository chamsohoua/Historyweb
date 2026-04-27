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
    { to:'/',         label:t('nav.home'),    emoji:'🏠' },
    { to:'/timeline', label:t('nav.timeline'), emoji:'⏳' },
    { to:'/people',   label:t('nav.people'),   emoji:'🦸' },
    { to:'/games',    label:t('nav.games'),    emoji:'🎮' },
    { to:'/facts',    label:t('nav.facts'),    emoji:'📊' },
    { to:'/gallery',  label:t('nav.gallery'),  emoji:'🖼️' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="nav-header">
      <NavLink to="/" className="nav-logo" onClick={closeMenu}>
        <span style={{fontSize:'1.8rem', animation:'float 3s ease-in-out infinite'}}>🇩🇿</span>
        <span>Algeria Quest</span>
      </NavLink>

      <button 
        className="hamburger-btn" 
        onClick={() => setMenuOpen(!menuOpen)} 
        aria-label="Toggle mobile menu"
      >
        {menuOpen ? '✖' : '☰'}
      </button>

      <div className={`nav-menu-wrapper ${menuOpen ? 'open' : ''}`}>
        
        <nav className="nav-menu-main">
          <ul className="nav-links">
            {links.map(({to, label, emoji}) => (
              <li key={to}>
                <NavLink 
                  to={to} 
                  end={to === '/'} 
                  className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {emoji} {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-controls">
          
          <div className="control-group lang-group">
            {['en','ar','fr'].map(l => (
              <button 
                key={l} 
                className={`lang-btn${lang === l ? ' active' : ''}`} 
                onClick={() => { switchLang(l); closeMenu(); }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button className={`theme-toggle${isDark ? ' dark-on' : ''}`} onClick={toggleTheme} title="Toggle theme">
            <div className="theme-toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
          </button>

          {isGuest ? (
            <div className="control-group auth-group">
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>🔑 {t('nav.login')}</NavLink>
              <button className="btn btn-green btn-sm" onClick={() => { navigate('/signup'); closeMenu(); }}>
                ✨ {t('nav.signup')}
              </button>
            </div>
          ) : (
            <div className="control-group user-group">
              <div className="user-badge">
                😊 {currentUser.username}
              </div>
              <button className="btn btn-ghost btn-sm logout-btn" onClick={() => { logout(); navigate('/'); closeMenu(); }}>
                👋 {t('nav.logout')}
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}