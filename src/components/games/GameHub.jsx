// src/components/games/GameHub.jsx
import { useNavigate }    from 'react-router-dom';
import { useAuth }        from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LangContext';

const GAMES = [
  {
    id:      'quiz',
    route:   '/games/quiz',
    icon:    '🧠',
    bg:      'linear-gradient(135deg, #3B1F8C, #6D35D9, #A78BFA)',
    shadow:  'rgba(109,53,217,0.45)',
    border:  'rgba(167,139,250,0.35)',
    badge:   '🎯 Available!',
    locked:  false,
    stars:   4,
    players: '2.4k plays',
  },
  {
    id:      'voice',
    route:   '/games/voice',
    icon:    '🎙️',
    bg:      'linear-gradient(135deg, #6B2500, #C94F0A, #FB923C)',
    shadow:  'rgba(201,79,10,0.45)',
    border:  'rgba(251,146,60,0.35)',
    badge:   '🔊 Available!',
    locked:  false,
    stars:   5,
    players: '1.8k plays',
  },
  {
    id:      'map',
    route:   '/games/map',
    icon:    '🗺️',
    bg:      'linear-gradient(135deg, #034030, #07845A, #34D399)',
    shadow:  'rgba(7,132,90,0.45)',
    border:  'rgba(52,211,153,0.35)',
    badge:   '🔥 Most Popular!',
    locked:  true,
    stars:   5,
    players: '5.1k plays',
  },
];

export default function GameHub() {
  const { isGuest } = useAuth();
  const { t }       = useTranslation();
  const navigate    = useNavigate();

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-page)', padding:'var(--sp-12) var(--sp-8)' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'var(--sp-12)' }}>
          <div style={{ fontSize:'4.5rem', marginBottom:'var(--sp-4)', animation:'float 3s ease-in-out infinite', filter:'drop-shadow(0 8px 24px rgba(255,217,61,0.4))' }}>
            🎮
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.2rem)', color:'var(--ink)', marginBottom:'var(--sp-3)' }}>
            {t('games.title')} <span style={{ color:'var(--coral)' }}>✦</span>
          </h1>
          <p style={{ color:'var(--ink-mid)', fontSize:'1.05rem', maxWidth:'480px', margin:'0 auto' }}>
            {t('games.sub')}
          </p>
        </div>

        {/* Game Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--sp-6)' }}>
          {GAMES.map((g, i) => {
            const locked = g.locked && isGuest;
            return (
              <GameCard
                key={g.id}
                game={g}
                locked={locked}
                index={i}
                onPlay={() => {
                  if (locked) { navigate('/login'); return; }
                  navigate(g.route);
                }}
                t={t}
              />
            );
          })}
        </div>

        {/* Guest notice */}
        {isGuest && (
          <div style={{
            marginTop:    'var(--sp-8)',
            background:   'var(--yellow-bg)',
            border:       '3px solid var(--yellow)',
            borderRadius: 'var(--r-lg)',
            padding:      'var(--sp-5) var(--sp-6)',
            display:      'flex', alignItems:'center', gap:'var(--sp-4)', flexWrap:'wrap',
            boxShadow:    '0 4px 0 var(--yellow-dark)',
          }}>
            <span style={{ fontSize:'1.8rem', animation:'float 2s ease-in-out infinite' }}>🔒</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'var(--yellow-dark)', marginBottom:'4px', fontSize:'1rem' }}>
                Map Challenge requires a free account!
              </div>
              <div style={{ fontSize:'0.85rem', color:'var(--ink-mid)' }}>
                Sign up in seconds to paint all 48 wilayas of Algeria 🗺️
              </div>
            </div>
            <button className="btn btn-yellow btn-sm" onClick={() => navigate('/signup')}>
              Join Free! 🎉
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px) { .games-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

/* ── Individual game card with isolated hover ──────────────── */
function GameCard({ game: g, locked, index: i, onPlay, t }) {
  return (
    <div
      className="anim-slide-up"
      style={{
        animationDelay: `${i * 0.12}s`,
        background:     g.bg,
        borderRadius:   'var(--r-2xl)',
        padding:        'var(--sp-10) var(--sp-6)',
        cursor:         locked ? 'not-allowed' : 'pointer',
        display:        'flex', flexDirection:'column', alignItems:'center',
        textAlign:      'center', gap:'var(--sp-4)',
        position:       'relative', overflow:'hidden',
        minHeight:      '400px', justifyContent:'center',
        filter:         locked ? 'brightness(0.6) saturate(0.7)' : 'brightness(1)',
        boxShadow:      `0 8px 0 ${g.shadow}, 0 16px 40px ${g.shadow}`,
        border:         `3px solid ${g.border}`,
        transition:     'transform 0.25s var(--spring), box-shadow 0.25s ease',
      }}
      onClick={onPlay}
      onMouseEnter={e => {
        if (locked) return;
        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02) rotate(-0.5deg)';
        e.currentTarget.style.boxShadow = `0 18px 0 ${g.shadow}, 0 28px 60px ${g.shadow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0)';
        e.currentTarget.style.boxShadow = `0 8px 0 ${g.shadow}, 0 16px 40px ${g.shadow}`;
      }}
    >
      {/* Rotating shimmer overlay */}
      <div style={{ position:'absolute', inset:0, background:'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.06) 25%, transparent 50%)', animation:'spin 10s linear infinite', pointerEvents:'none' }}/>

      {/* Badge top-right */}
      <div style={{
        position:      'absolute', top:'14px', right:'14px',
        background:    'rgba(255,255,255,0.2)',
        backdropFilter:'blur(8px)',
        border:        '2px solid rgba(255,255,255,0.3)',
        borderRadius:  'var(--r-pill)', padding:'4px 12px',
        fontSize:      '0.68rem', fontWeight:800, color:'white', letterSpacing:'0.04em',
      }}>
        {locked ? '🔒 Login to Play' : g.badge}
      </div>

      {/* Players badge bottom-left */}
      <div style={{
        position:   'absolute', bottom:'14px', left:'14px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius:'var(--r-pill)', padding:'3px 10px',
        fontSize:   '0.65rem', fontWeight:700, color:'rgba(255,255,255,0.85)',
      }}>
        👥 {g.players}
      </div>

      {/* Stars */}
      <div style={{ display:'flex', gap:'4px', position:'relative', zIndex:1 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} style={{ fontSize:'1rem', opacity: n <= g.stars ? 1 : 0.25, filter: n <= g.stars ? 'drop-shadow(0 0 4px rgba(255,217,61,0.8))' : 'none' }}>⭐</span>
        ))}
      </div>

      {/* Icon */}
      <div style={{ fontSize:'5.5rem', animation:`float ${3 + i * 0.5}s ease-in-out infinite`, filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.35))', position:'relative', zIndex:1 }}>
        {g.icon}
      </div>

      {/* Title */}
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, color:'white', position:'relative', zIndex:1, lineHeight:1.15, textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        {t(`games.${g.id}`)}
      </h2>

      {/* Desc */}
      <p style={{ fontSize:'0.87rem', color:'rgba(255,255,255,0.85)', maxWidth:'210px', lineHeight:1.65, position:'relative', zIndex:1, margin:0 }}>
        {t(`games.${g.id}.desc`)}
      </p>

      {/* CTA button */}
      <button
        tabIndex={-1}
        style={{
          background:    'rgba(255,255,255,0.22)',
          backdropFilter:'blur(8px)',
          border:        '2.5px solid rgba(255,255,255,0.4)',
          borderRadius:  'var(--r-pill)',
          padding:       'var(--sp-3) var(--sp-8)',
          color:         'white',
          fontFamily:    'var(--font-display)',
          fontWeight:    800,
          fontSize:      '0.92rem',
          letterSpacing: '0.04em',
          cursor:        locked ? 'not-allowed' : 'pointer',
          position:      'relative', zIndex:1,
          boxShadow:     '0 4px 0 rgba(0,0,0,0.2)',
          transition:    'all 0.15s ease',
        }}
      >
        {locked ? `🔒 ${t('games.locked')}` : `${t('games.play')} →`}
      </button>
    </div>
  );
}
