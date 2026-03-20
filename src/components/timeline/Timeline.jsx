// src/components/timeline/Timeline.jsx
import { useState, useRef } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../../context/AuthContext';
import { useTranslation }   from '../../i18n/LangContext';
import { timelineEvents as DEFAULT_TIMELINE } from '../../data/timelineData';
import { useContent } from '../../hooks/useContent';
import '../../styles/Timeline.css';

const CATEGORIES = ['All','colonial','resistance','nationalism','revolution','independence','postindependence','modern'];

export default function Timeline() {
  const { currentUser, isGuest } = useAuth();
  const { t }        = useTranslation();
  const navigate     = useNavigate();
  const scrollRef    = useRef(null);
  const dragging     = useRef(false);
  const startX       = useRef(0);
  const scrollLeft   = useRef(0);
  const hasDragged   = useRef(false);

  // Live events from Firestore (admin-editable)
  const { data: tlData } = useContent('timeline', { events: DEFAULT_TIMELINE });
  const timelineEvents = tlData?.events?.length ? tlData.events : DEFAULT_TIMELINE;

  const [activeEv, setActiveEv] = useState(null);
  const [filter,   setFilter]   = useState('All');
  const [dotIdx,   setDotIdx]   = useState(0);
  const [isDrag,   setIsDrag]   = useState(false);

  const events = filter === 'All' ? timelineEvents : timelineEvents.filter(e => e.category === filter);
  const done   = currentUser?.completedQuestions?.length ?? 0;

  const onMD = e => { dragging.current=true; hasDragged.current=false; startX.current=e.pageX-scrollRef.current.offsetLeft; scrollLeft.current=scrollRef.current.scrollLeft; setIsDrag(true); };
  const onMM = e => { if(!dragging.current)return; e.preventDefault(); const w=(e.pageX-scrollRef.current.offsetLeft-startX.current)*1.3; if(Math.abs(w)>4)hasDragged.current=true; scrollRef.current.scrollLeft=scrollLeft.current-w; updateDot(); };
  const onMU = () => { dragging.current=false; setIsDrag(false); };
  const onTS = e => { dragging.current=true; hasDragged.current=false; startX.current=e.touches[0].pageX; scrollLeft.current=scrollRef.current.scrollLeft; };
  const onTM = e => { if(!dragging.current)return; const w=(e.touches[0].pageX-startX.current)*1.2; if(Math.abs(w)>4)hasDragged.current=true; scrollRef.current.scrollLeft=scrollLeft.current-w; updateDot(); };

  const scroll = d => { scrollRef.current.scrollBy({left:d*560,behavior:'smooth'}); setTimeout(updateDot,350); };
  const updateDot = () => { if(!scrollRef.current)return; const {scrollLeft:sl,scrollWidth,clientWidth}=scrollRef.current; const p=sl/(scrollWidth-clientWidth); setDotIdx(Math.round(p*(events.length-1))); };
  const scrollTo = i => { scrollRef.current.scrollTo({left:i*210,behavior:'smooth'}); setDotIdx(i); };

  return (
    <div className="timeline-page">

      <div className="tl-hero">
        <div className="tl-year-pill">{t('timeline.pill')}</div>
        <h1><span className="green">{t('timeline.title').split(' ').slice(0,1).join(' ')}</span>{' '}{t('timeline.title').split(' ').slice(1).join(' ')}</h1>
        <p>{t('timeline.sub')}</p>
        <div className="tl-scroll-hint">{t('timeline.drag')} <span className="arrow">→</span></div>
      </div>

      {isGuest && (
        <div className="tl-guest-banner">
          <span style={{ fontSize:'2rem', animation:'float 2s ease-in-out infinite' }}>👋</span>
          <div style={{ flex:1 }}>
            <h4>{t('timeline.guest.title')}</h4>
            <p>{t('timeline.guest.sub')}</p>
          </div>
          <button className="btn btn-yellow btn-sm" onClick={() => navigate('/signup')}>{t('timeline.guest.btn')}</button>
        </div>
      )}

      <div className="tl-filters">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`tl-filter-chip${filter===cat?' active':''}`} onClick={() => { setFilter(cat); setDotIdx(0); }}>
            {cat === 'All' ? '✦ All' : cat}
          </button>
        ))}
      </div>

      <div className="tl-track-wrap">
        <button className="tl-nav-btn prev" onClick={() => scroll(-1)}>‹</button>
        <button className="tl-nav-btn next" onClick={() => scroll(1)}>›</button>

        <div className={`tl-scroll-area drag-zone${isDrag?' grabbing':''}`} ref={scrollRef}
          onMouseDown={onMD} onMouseUp={onMU} onMouseLeave={onMU} onMouseMove={onMM}
          onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={() => { dragging.current=false; }}>
          <div className="tl-rail">
            <div className="tl-line" style={{ width:events.length*210+200+'px' }}/>
            <div className="tl-cap"><div className="tl-cap-icon">🌅</div><div className="tl-cap-label">1827</div></div>
            {events.map((ev, i) => (
              <div key={ev.id} className={`tl-event${i%2===0?' above':''} anim-slide-up`}
                style={{ animationDelay:`${i*0.03}s`, '--event-color':ev.color }}
                onClick={() => { if(!hasDragged.current) setActiveEv(ev); }}>
                <div className="tl-event-card">
                  <span className="tl-event-icon">{ev.icon}</span>
                  <div className="tl-event-year" style={{ color:ev.color, fontFamily:'var(--font-display)', fontWeight:800 }}>{ev.year}</div>
                  <div className="tl-event-title">{ev.title}</div>
                  <div className="tl-event-stars">{[1,2,3,4,5].map(n=><span key={n} className={`tl-event-star${n<=ev.importance?' lit':''}`}>★</span>)}</div>
                </div>
                <div className="tl-event-stem"/>
              </div>
            ))}
            <div className="tl-cap"><div className="tl-cap-icon">🇩🇿</div><div className="tl-cap-label">Today</div></div>
          </div>
        </div>
      </div>

      <div className="tl-dot-indicator">
        {events.map((_, i) => (
          <div key={i} className={`tl-dot${i===dotIdx?' active':i<dotIdx?' viewed':''}`} onClick={() => scrollTo(i)}/>
        ))}
      </div>

      <div className="tl-progress-section">
        <span className="tl-progress-label">📚 {t('timeline.progress')}</span>
        <div style={{ flex:1, minWidth:'160px' }}>
          <div className="progress-track"><div className="progress-fill" style={{ width:`${(done/69)*100}%` }}/></div>
        </div>
        <span className="tl-progress-count">{done} / 69 ⭐</span>
        <button className="btn btn-green btn-sm" onClick={() => navigate('/games/map')}>{t('timeline.mapbtn')}</button>
      </div>

      {activeEv && (
        <div className="overlay-backdrop" onClick={() => setActiveEv(null)}>
          <div className="tl-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveEv(null)}>✕</button>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'var(--sp-4)', marginBottom:'var(--sp-5)' }}>
              <div className="tl-detail-icon-wrap" style={{ borderColor:activeEv.color+'55', background:activeEv.color+'15' }}>{activeEv.icon}</div>
              <div>
                <div className="tl-detail-year-badge" style={{ background:activeEv.color+'15', border:`2.5px solid ${activeEv.color}55`, color:activeEv.color }}>{activeEv.year}</div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.1rem,3vw,1.5rem)', color:'var(--ink)', lineHeight:1.2, marginBottom:'8px' }}>{activeEv.title}</h2>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  <span className="badge badge-green">{activeEv.era}</span>
                  <span className="badge" style={{ background:activeEv.color+'15', color:activeEv.color, border:`2px solid ${activeEv.color}44` }}>{activeEv.category}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign:'right', direction:'rtl', fontFamily:'var(--font-arabic)', fontSize:'1.05rem', color:activeEv.color, padding:'var(--sp-3) var(--sp-4)', background:activeEv.color+'0D', border:`2px dashed ${activeEv.color}44`, borderRadius:'var(--r-lg)', marginBottom:'var(--sp-4)' }}>
              {activeEv.titleAr}
            </div>
            <div className="tl-detail-body">{activeEv.body}</div>
            <div style={{ marginTop:'var(--sp-6)', display:'flex', gap:'10px', justifyContent:'flex-end', flexWrap:'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveEv(null)}>{t('timeline.modal.close')}</button>
              <button className="btn btn-green btn-sm" onClick={() => { setActiveEv(null); navigate('/games'); }}>{t('timeline.modal.quiz')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
