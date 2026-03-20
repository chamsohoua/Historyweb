// src/components/home/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LangContext';
import { useAuth }        from '../../context/AuthContext';
import { timelineEvents } from '../../data/timelineData';
import { useContent }      from '../../hooks/useContent';

function AnimCounter({ to, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / duration, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const HERO_STICKERS = [
  { emoji: '🌴', top: '12%', left: '6%',   size: '2.8rem', delay: '0s',   speed: '4s'   },
  { emoji: '⚔️',  top: '20%', right: '8%',  size: '2.4rem', delay: '0.7s', speed: '3.5s' },
  { emoji: '🦁', top: '65%', left: '4%',   size: '2.5rem', delay: '1.2s', speed: '5s'   },
  { emoji: '🕌', top: '70%', right: '6%',  size: '2.8rem', delay: '0.4s', speed: '4.5s' },
  { emoji: '📜', top: '38%', left: '2%',   size: '2rem',   delay: '1.8s', speed: '3.8s' },
  { emoji: '🌟', top: '30%', right: '3%',  size: '2.2rem', delay: '0.9s', speed: '4.2s' },
  { emoji: '🦅', top: '82%', left: '14%',  size: '2rem',   delay: '1.5s', speed: '3.6s' },
  { emoji: '🏺', top: '80%', right: '14%', size: '2.2rem', delay: '0.3s', speed: '4.8s' },
];

const FEATURED = [
  timelineEvents.find(e => e.id === 'revolution1954'),
  timelineEvents.find(e => e.id === 'independence1962'),
  timelineEvents.find(e => e.id === 'abdelkader1832'),
  timelineEvents.find(e => e.id === 'setif1945'),
  timelineEvents.find(e => e.id === 'hirak2019'),
  timelineEvents.find(e => e.id === 'mokrani1871'),
].filter(Boolean);

const ERAS = [
  { era: 'Ottoman Period',       years: '1516–1830', color: '#D4AF37', events: 2,  icon: '🕌', bgVar: 'var(--yellow-bg)' },
  { era: 'French Colonization',  years: '1830–1954', color: '#FF6B6B', events: 10, icon: '⚔️',  bgVar: 'var(--coral-bg)'  },
  { era: 'The Revolution',       years: '1954–1962', color: '#FF9F43', events: 8,  icon: '🔥', bgVar: 'var(--orange-bg)' },
  { era: 'Building the Nation',  years: '1962–1988', color: '#4ade80', events: 8,  icon: '🏗️', bgVar: 'var(--green-bg)'  },
  { era: 'Democratic Struggle',  years: '1988–2000', color: '#9B59B6', events: 5,  icon: '✊', bgVar: 'var(--purple-bg)' },
  { era: 'Contemporary Algeria', years: '2000–2026', color: '#4ECDC4', events: 4,  icon: '🇩🇿', bgVar: 'var(--sky-bg)'    },
];

const QUOTES_KEYS = [
  { text: 'By our revolution, we prove we can govern ourselves.',         author: 'Ahmed Ben Bella, 1962'  },
  { text: 'We did not take up arms to seize power, but to build a state.', author: 'FLN Declaration, 1954'  },
  { text: 'The blood of the martyrs waters the tree of freedom.',          author: 'Algerian Proverb'       },
  { text: 'A nation that forgets its history is a nation without roots.',   author: 'Algerian Wisdom'        },
];

export default function HomePage() {
  const { t }       = useTranslation();
  const { isGuest } = useAuth();
  const navigate    = useNavigate();
  const [factIdx,  setFactIdx]  = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);

const { data: cms } = useContent('homepage', {
    quotes: QUOTES_KEYS,
    facts:  null,
    eras:   null,
  });
  const LIVE_QUOTES = cms?.quotes?.length ? cms.quotes : QUOTES_KEYS;
  const LIVE_FACTS  = cms?.facts?.length  ? cms.facts  : null;
  const LIVE_ERAS   = cms?.eras?.length   ? cms.eras   : null;
  // ─────────────────────────────────────────────────────────

  const FACTS = LIVE_FACTS || [
    { emoji: '🦁', text: t('home.fact.1') || 'Algeria is home to the Barbary lion, once roaming its Atlas Mountains.' },
    { emoji: '🗿', text: t('home.fact.2') || "Tassili n'Ajjer has 15,000+ cave paintings!" },
    { emoji: '🌍', text: t('home.fact.3') || 'Algeria is the LARGEST country in Africa!' },
    { emoji: '📚', text: t('home.fact.4') || "Ibn Khaldoun wrote the world's first sociology book in 1377!" },
    { emoji: '🏺', text: t('home.fact.5') || 'Timgad is called the Pompeii of Africa!' },
    { emoji: '⭐', text: t('home.fact.6') || 'A US city is named after Emir Abdelkader: Elkader, Iowa!' },
    { emoji: '🌊', text: t('home.fact.7') || 'Algeria has 1,200 km of Mediterranean coastline!' },
    { emoji: '🔥', text: t('home.fact.8') || 'On November 1, 1954, the FLN launched 70 simultaneous attacks!' },
  ];

  const EXPLORE = [
    { icon: '⏳', label: t('nav.timeline'), sub: '37 ' + (t('home.stat.events') || 'events'), route: '/timeline',  bg: 'var(--green-bg)',  border: 'var(--green-light)', accent: 'var(--green-mid)'  },
    { icon: '🦸', label: t('nav.people'),   sub: '12 legends',                                 route: '/people',    bg: 'var(--coral-bg)',  border: 'var(--coral-light)', accent: 'var(--coral-dark)' },
    { icon: '🎮', label: t('nav.games'),    sub: 'Quiz + Map!',                                route: '/games',     bg: 'var(--yellow-bg)', border: 'var(--yellow)',      accent: 'var(--yellow-dark)'},
    { icon: '🗺️', label: t('map.title'),    sub: '48 ' + (t('home.stat.wilayas') || 'wilayas'), route: '/games/map', bg: 'var(--sky-bg)',    border: 'var(--sky-light)',   accent: 'var(--sky-dark)'   },
    { icon: '📊', label: t('nav.facts'),    sub: t('facts.sub') || 'In numbers',               route: '/facts',     bg: 'var(--purple-bg)', border: 'var(--purple-light)',accent: 'var(--purple)'     },
    { icon: '🖼️', label: t('nav.gallery'),  sub: t('gallery.sub') || 'Visual history',         route: '/gallery',   bg: 'var(--orange-bg)', border: 'var(--orange)',      accent: 'var(--orange-dark)'},
  ];

  const STATS = [
    { val: 37,      suffix: '',  label: t('home.stat.events'),  emoji: '📅', colorVar: 'var(--green-mid)'   },
    { val: 1500000, suffix: '+', label: t('home.stat.martyrs'), emoji: '🕊️', colorVar: 'var(--coral-dark)'  },
    { val: 199,     suffix: '',  label: t('home.stat.years'),   emoji: '⏳', colorVar: 'var(--yellow-dark)' },
    { val: 48,      suffix: '',  label: t('home.stat.wilayas'), emoji: '🗺️', colorVar: 'var(--sky-dark)'    },
  ];

  useEffect(() => {
    const id = setInterval(() => setFactIdx(i => (i + 1) % FACTS.length), 5000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES_KEYS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const fact  = FACTS[factIdx % FACTS.length];
  const quote = LIVE_QUOTES[quoteIdx % LIVE_QUOTES.length];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position:'relative', overflow:'hidden', background:'var(--bg-hero)', minHeight:'92vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'var(--sp-20) var(--sp-8) var(--sp-16)', borderBottom:'4px solid var(--border)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(26,143,79,0.08) 1.5px,transparent 1.5px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'8px', background:'linear-gradient(90deg,#006233 50%,white 50%)', opacity:0.45 }}/>
        <div style={{ position:'absolute', top:'8px', left:0, right:0, height:'4px', background:'#D21034', opacity:0.28 }}/>

        {HERO_STICKERS.map((s, i) => (
          <div key={i} style={{ position:'absolute', top:s.top, left:s.left, right:s.right, fontSize:s.size, animation:`float ${s.speed} ease-in-out infinite`, animationDelay:s.delay, filter:'drop-shadow(2px 4px 8px rgba(0,0,0,0.14))', pointerEvents:'none', zIndex:0, userSelect:'none' }}>
            {s.emoji}
          </div>
        ))}

        <div className="anim-float" style={{ fontSize:'6rem', marginBottom:'var(--sp-4)', filter:'drop-shadow(0 8px 24px rgba(0,98,51,0.25))', position:'relative', zIndex:1 }}>🇩🇿</div>

        <div className="anim-slide-up" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--bg-surface)', border:'3px solid var(--yellow)', borderRadius:'var(--r-pill)', padding:'6px 20px', fontSize:'0.82rem', fontWeight:800, color:'var(--yellow-dark)', marginBottom:'var(--sp-4)', boxShadow:'0 4px 0 var(--yellow-dark)', position:'relative', zIndex:1, animation:'bounceIn 0.6s var(--bounce) 0.1s both' }}>
          🎉 {t('home.hero.sub').split(',')[0]}
        </div>

        <h1 className="anim-slide-up delay-2" style={{ fontSize:'clamp(2.8rem,8vw,6rem)', fontFamily:'var(--font-display)', fontWeight:800, lineHeight:1.05, marginBottom:'var(--sp-4)', position:'relative', zIndex:1 }}>
          <span style={{ color:'var(--green)', display:'block' }}>{t('home.Algeria')}</span>
          <span style={{ background:'linear-gradient(135deg,var(--coral),var(--orange))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'block' }}>
            {t('home.history')}
          </span>
        </h1>

        <p className="anim-slide-up delay-3" style={{ fontSize:'clamp(1rem,2.5vw,1.25rem)', color:'var(--ink-mid)', maxWidth:'560px', lineHeight:1.7, marginBottom:'var(--sp-8)', position:'relative', zIndex:1 }}>
          {t('home.hero.sub')} 🌟
        </p>

        <div className="anim-slide-up delay-4" style={{ display:'flex', gap:'var(--sp-4)', flexWrap:'wrap', justifyContent:'center', position:'relative', zIndex:1 }}>
          <button className="btn btn-green btn-xl" onClick={() => navigate('/timeline')}>🚀 {t('home.hero.cta')}</button>
          <button className="btn btn-yellow btn-xl" onClick={() => navigate('/games/map')}>🗺️ {t('home.hero.cta2')}</button>
        </div>

        <div style={{ position:'absolute', bottom:'24px', left:'50%', transform:'translateX(-50%)', animation:'float 2s ease-in-out infinite', color:'var(--ink-light)', fontSize:'1.4rem', zIndex:1 }}>↓</div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'var(--bg-surface)', borderBottom:'3px solid var(--border)', padding:'var(--sp-12) var(--sp-8)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--sp-6)', textAlign:'center' }}>
          {STATS.map((s, i) => (
            <div key={i} className="anim-slide-up card" style={{ animationDelay:`${i*0.08}s`, padding:'var(--sp-6)', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'8px', animation:`float ${3+i*0.4}s ease-in-out infinite` }}>{s.emoji}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:800, color:s.colorVar, lineHeight:1 }}>
                <AnimCounter to={s.val} suffix={s.suffix}/>
              </div>
              <div style={{ color:'var(--ink-light)', fontSize:'0.82rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section style={{ padding:'var(--sp-12) var(--sp-8)', background:'var(--bg-quote)', borderBottom:'3px solid var(--border)' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:'3.5rem', color:'var(--yellow-dark)', fontFamily:'Georgia', lineHeight:1, marginBottom:'8px', opacity:0.5 }}>"</div>
          <blockquote key={quoteIdx} style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.1rem,3vw,1.7rem)', color:'var(--ink)', lineHeight:1.5, marginBottom:'var(--sp-4)', fontStyle:'italic', animation:'fadeIn 0.5s ease' }}>
            {quote.text}
          </blockquote>
          <div style={{ fontWeight:700, color:'var(--green-mid)', fontSize:'0.9rem' }}>— {quote.author}</div>
          <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'var(--sp-4)' }}>
            {LIVE_QUOTES.map((_, i) => (
              <div key={i} onClick={() => setQuoteIdx(i)} style={{ width:i===quoteIdx?'24px':'8px', height:'8px', borderRadius:'4px', cursor:'pointer', background:i===quoteIdx?'var(--green-mid)':'var(--sand-dark)', transition:'all 0.3s var(--spring)' }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section style={{ padding:'var(--sp-16) var(--sp-8)', background:'var(--bg-page)' }}>
        <div style={{ maxWidth:'1300px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'var(--sp-10)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', color:'var(--ink)' }}>📚 {t('home.featured.title')} <span style={{ color:'var(--coral)' }}>✦</span></h2>
            <p style={{ color:'var(--ink-mid)', marginTop:'8px' }}>{t('home.featured.sub')}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--sp-5)' }}>
            {FEATURED.map((ev, i) => (
              <div key={ev.id} className="card card-stripe anim-slide-up" style={{ '--stripe-color':ev.color, padding:'var(--sp-6)', cursor:'pointer', animationDelay:`${i*0.07}s` }} onClick={() => navigate('/timeline')}>
                <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-3)', marginBottom:'var(--sp-3)' }}>
                  <div style={{ width:'54px', height:'54px', borderRadius:'var(--r-lg)', background:ev.color+'18', border:`3px solid ${ev.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', animation:`float ${3+i*0.3}s ease-in-out infinite`, flexShrink:0 }}>{ev.icon}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.2rem', color:ev.color }}>{ev.year}</div>
                    <span className="badge badge-green" style={{ fontSize:'0.65rem' }}>{ev.category}</span>
                  </div>
                </div>
                <h3 style={{ fontSize:'0.95rem', fontFamily:'var(--font-display)', color:'var(--ink)', marginBottom:'6px', lineHeight:1.3 }}>{ev.title}</h3>
                <p style={{ fontSize:'0.8rem', color:'var(--ink-light)', lineHeight:1.6, margin:0 }}>{ev.short}</p>
                <div style={{ marginTop:'12px', display:'flex', gap:'3px' }}>
                  {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize:'0.75rem', color:n<=ev.importance?ev.color:'var(--sand-dark)' }}>★</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'var(--sp-8)' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/timeline')}>{t('home.viewall')}</button>
          </div>
        </div>
      </section>

      {/* ── EXPLORE GRID ── */}
      <section style={{ padding:'var(--sp-12) var(--sp-8)', background:'var(--bg-explore)', borderTop:'3px solid var(--border)', borderBottom:'3px solid var(--border)' }}>
        <div style={{ maxWidth:'1300px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'var(--sp-8)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', color:'var(--ink)' }}>🗺️ {t('home.explore.title')}</h2>
            <p style={{ color:'var(--ink-mid)', marginTop:'8px' }}>{t('home.explore.sub')}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'var(--sp-4)' }}>
            {EXPLORE.map((c, i) => (
              <div key={c.route} className="anim-pop-in" style={{ animationDelay:`${i*0.06}s`, background:c.bg, border:`3px solid ${c.border}`, borderRadius:'var(--r-2xl)', padding:'var(--sp-6) var(--sp-4)', cursor:'pointer', textAlign:'center', transition:'transform 0.2s var(--spring),box-shadow 0.2s ease', boxShadow:`0 5px 0 ${c.border}` }}
                onClick={() => navigate(c.route)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px) rotate(-1deg)'; e.currentTarget.style.boxShadow=`0 10px 0 ${c.border}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0) rotate(0)'; e.currentTarget.style.boxShadow=`0 5px 0 ${c.border}`; }}
              >
                <div style={{ fontSize:'2.5rem', marginBottom:'8px', animation:`float ${3+i*0.4}s ease-in-out infinite` }}>{c.icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color:c.accent, marginBottom:'4px' }}>{c.label}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--ink-light)', fontWeight:600 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DID YOU KNOW ── */}
      <section style={{ padding:'var(--sp-16) var(--sp-8)', background:'var(--bg-page)' }}>
        <div style={{ maxWidth:'860px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:'var(--font-display)', color:'var(--ink)', marginBottom:'var(--sp-8)' }}>💡 {t('home.facts.title')}</h2>
          <div key={factIdx} className="card" style={{ padding:'var(--sp-8) var(--sp-10)', background:'var(--bg-fact)', border:'3px solid var(--sky-light)', boxShadow:'0 6px 0 var(--sky-light)', animation:'bounceIn 0.4s var(--bounce)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'var(--sp-4)', animation:'wobble 0.7s var(--bounce)' }}>{fact.emoji}</div>
            <p style={{ fontSize:'clamp(1rem,2.5vw,1.25rem)', color:'var(--ink)', fontWeight:600, lineHeight:1.7, margin:0 }}>{fact.text}</p>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'var(--sp-5)' }}>
            {FACTS.map((_, i) => (
              <div key={i} onClick={() => setFactIdx(i)} style={{ width:i===factIdx?'24px':'8px', height:'8px', borderRadius:'4px', cursor:'pointer', background:i===factIdx?'var(--sky-dark)':'var(--sand-dark)', transition:'all 0.3s var(--spring)' }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── ERA STRIPS ── */}
      <section style={{ padding:'var(--sp-16) var(--sp-8)', background:'var(--bg-eras)', borderTop:'3px solid var(--border)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-display)', textAlign:'center', color:'var(--ink)', marginBottom:'var(--sp-8)' }}>📖 {t('home.eras.title')}</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-3)' }}>
            {(LIVE_ERAS || ERAS).map((row, i) => (
              <div key={row.era} className="anim-slide-up" style={{ animationDelay:`${i*0.07}s`, background:row.bgVar, border:`3px solid ${row.color}44`, borderLeft:`6px solid ${row.color}`, borderRadius:'var(--r-lg)', padding:'var(--sp-4) var(--sp-5)', display:'flex', alignItems:'center', gap:'var(--sp-4)', cursor:'pointer', transition:'all 0.2s var(--spring)' }}
                onClick={() => navigate('/timeline')}
                onMouseEnter={e => { e.currentTarget.style.transform='translateX(8px) scale(1.01)'; e.currentTarget.style.boxShadow=`0 4px 0 ${row.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateX(0) scale(1)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <span style={{ fontSize:'1.8rem', flexShrink:0, animation:`float ${3+i*0.3}s ease-in-out infinite` }}>{row.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'var(--ink)', fontSize:'1rem' }}>{row.era}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--ink-light)', marginTop:'2px' }}>{row.years} · {row.events} key events</div>
                </div>
                <div style={{ width:'120px', background:'var(--sand)', borderRadius:'var(--r-pill)', height:'10px', overflow:'hidden', border:'2px solid var(--border)', flexShrink:0 }}>
                  <div style={{ width:`${(row.events/12)*100}%`, height:'100%', background:row.color, borderRadius:'var(--r-pill)', transition:'width 1s var(--spring)' }}/>
                </div>
                <span style={{ color:row.color, fontSize:'1.2rem', flexShrink:0 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (guest only) ── */}
      {isGuest && (
        <section style={{ padding:'var(--sp-16) var(--sp-8)', background:'var(--bg-cta)', borderTop:'3px solid var(--border)' }}>
          <div style={{ maxWidth:'700px', margin:'0 auto', textAlign:'center' }}>
            <div style={{ fontSize:'4rem', marginBottom:'var(--sp-5)', animation:'float 3s ease-in-out infinite' }}>🎊</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'var(--ink)', marginBottom:'var(--sp-4)' }}>{t('home.cta.title')}</h2>
            <p style={{ color:'var(--ink-mid)', fontSize:'1.05rem', marginBottom:'var(--sp-8)', lineHeight:1.7 }}>{t('home.cta.sub')}</p>
            <div style={{ display:'flex', gap:'var(--sp-4)', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn btn-green btn-xl" onClick={() => navigate('/signup')}>{t('home.cta.btn')}</button>
              <button className="btn btn-ghost btn-xl" onClick={() => navigate('/login')}>{t('home.cta.login')}</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
