// src/components/content/GalleryScreen.jsx
import { useState } from 'react';
import { useTranslation } from '../../i18n/LangContext';
import { useContent }     from '../../hooks/useContent';

const GALLERY_ITEMS = [
  { id:1,  titleKey:'gallery.item.casbah',      year:'16th c.',    catKey:'gallery.cat.architecture', icon:'🏛️', descKey:'gallery.item.casbah.desc',      color:'#D4AF37' },
  { id:2,  titleKey:'gallery.item.tassili',     year:'~8,000 BC',  catKey:'gallery.cat.ancient',      icon:'🦣', descKey:'gallery.item.tassili.desc',     color:'#F97316' },
  { id:3,  titleKey:'gallery.item.timgad',      year:'100 AD',     catKey:'gallery.cat.ancient',      icon:'🏺', descKey:'gallery.item.timgad.desc',      color:'#EF4444' },
  { id:4,  titleKey:'gallery.item.abdelkader',  year:'1832–1847',  catKey:'gallery.cat.heroes',       icon:'🏇', descKey:'gallery.item.abdelkader.desc',  color:'#7C3AED' },
  { id:5,  titleKey:'gallery.item.nov1',        year:'1954',       catKey:'gallery.cat.revolution',   icon:'🔥', descKey:'gallery.item.nov1.desc',        color:'#DC2626' },
  { id:6,  titleKey:'gallery.item.soummam',     year:'1956',       catKey:'gallery.cat.revolution',   icon:'📜', descKey:'gallery.item.soummam.desc',     color:'#10B981' },
  { id:7,  titleKey:'gallery.item.battlealg',   year:'1957',       catKey:'gallery.cat.revolution',   icon:'🏙️', descKey:'gallery.item.battlealg.desc',   color:'#F59E0B' },
  { id:8,  titleKey:'gallery.item.july5',       year:'1962',       catKey:'gallery.cat.independence', icon:'🌟', descKey:'gallery.item.july5.desc',       color:'#D4AF37' },
  { id:9,  titleKey:'gallery.item.ahaggar',     year:'Timeless',   catKey:'gallery.cat.nature',       icon:'🏔️', descKey:'gallery.item.ahaggar.desc',     color:'#6B7280' },
  { id:10, titleKey:'gallery.item.constantine', year:'Various',    catKey:'gallery.cat.architecture', icon:'🌉', descKey:'gallery.item.constantine.desc', color:'#38BDF8' },
  { id:11, titleKey:'gallery.item.ghardaia',    year:'11th c.',    catKey:'gallery.cat.architecture', icon:'🕌', descKey:'gallery.item.ghardaia.desc',    color:'#A78BFA' },
  { id:12, titleKey:'gallery.item.hirak',       year:'2019',       catKey:'gallery.cat.modern',       icon:'🌊', descKey:'gallery.item.hirak.desc',       color:'#10B981' },
  { id:13, titleKey:'gallery.item.oases',       year:'Ancient',    catKey:'gallery.cat.nature',       icon:'🌴', descKey:'gallery.item.oases.desc',       color:'#16A34A' },
  { id:14, titleKey:'gallery.item.djurdjura',   year:'Timeless',   catKey:'gallery.cat.nature',       icon:'⛰️', descKey:'gallery.item.djurdjura.desc',   color:'#3B82F6' },
  { id:15, titleKey:'gallery.item.fatma',       year:'1830–1863',  catKey:'gallery.cat.heroes',       icon:'🌸', descKey:'gallery.item.fatma.desc',       color:'#EC4899' },
  { id:16, titleKey:'gallery.item.oil',         year:'1971',       catKey:'gallery.cat.modern',       icon:'🛢️', descKey:'gallery.item.oil.desc',         color:'#D4AF37' },
];

const CAT_KEYS = [
  'gallery.filter.all',
  'gallery.cat.ancient',
  'gallery.cat.architecture',
  'gallery.cat.heroes',
  'gallery.cat.revolution',
  'gallery.cat.independence',
  'gallery.cat.nature',
  'gallery.cat.modern',
];

export default function GalleryScreen() {
  const { t } = useTranslation();
  const [filterKey, setFilterKey] = useState('gallery.filter.all');
  const [selected, setSelected]   = useState(null);

  const visible = filterKey === 'gallery.filter.all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.catKey === filterKey);

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100vh', padding:'var(--sp-12) var(--sp-8)' }}>
      <div style={{ maxWidth:'1300px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'var(--sp-10)' }}>
          <div style={{ fontSize:'4rem', marginBottom:'var(--sp-4)', animation:'float 3s ease-in-out infinite' }}>🖼️</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--ink)', marginBottom:'var(--sp-3)' }}>
            {t('gallery.title')}
          </h1>
          <p style={{ color:'var(--ink-mid)', fontSize:'1.05rem', maxWidth:'500px', margin:'0 auto' }}>
            {t('gallery.sub')}
          </p>
        </div>

        {/* Category filter pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--sp-2)', justifyContent:'center', marginBottom:'var(--sp-8)' }}>
          {CAT_KEYS.map(key => (
            <button key={key} onClick={() => setFilterKey(key)} style={{
              background:    filterKey===key ? 'var(--green-mid)' : 'var(--bg-surface)',
              color:         filterKey===key ? 'white' : 'var(--ink-mid)',
              border:        `2.5px solid ${filterKey===key?'var(--green-mid)':'var(--border-mid)'}`,
              borderRadius:  'var(--r-pill)',
              padding:       '6px 18px',
              fontSize:      '0.8rem', fontWeight:800, cursor:'pointer',
              transition:    'all 0.15s var(--bounce)',
              boxShadow:     filterKey===key?'0 4px 0 var(--green-dark)':'0 3px 0 var(--border-mid)',
              transform:     filterKey===key?'translateY(-1px)':'none',
            }}>
              {t(key)}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--sp-4)' }}>
          {visible.map((item, i) => {
            const isTall = i % 5 === 0 || i % 7 === 0;
            return (
              <div key={item.id} className="card anim-scale-in" style={{ animationDelay:`${i*0.05}s`, cursor:'pointer', gridRow:isTall?'span 2':'span 1', minHeight:isTall?'360px':'220px', display:'flex', flexDirection:'column', overflow:'hidden', borderColor:item.color+'22' }}
                onClick={() => setSelected(item)}>
                {/* Visual */}
                <div style={{ flex:isTall?'1 1 220px':'1 1 120px', background:`linear-gradient(135deg,${item.color}22,${item.color}08)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', borderBottom:`1px solid ${item.color}22` }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle,${item.color}15 1px,transparent 1px)`, backgroundSize:'20px 20px', pointerEvents:'none' }}/>
                  <div style={{ fontSize:isTall?'5rem':'3.5rem', animation:`float ${3+(i%3)*0.5}s ease-in-out infinite`, filter:`drop-shadow(0 4px 12px ${item.color}44)`, position:'relative', zIndex:1 }}>
                    {item.icon}
                  </div>
                  <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.35)', border:`1px solid ${item.color}44`, borderRadius:'var(--r-pill)', padding:'3px 10px', fontSize:'0.7rem', fontWeight:700, color:item.color, backdropFilter:'blur(8px)' }}>
                    {item.year}
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding:'var(--sp-4)', flex:'0 0 auto' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:800, color:item.color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>
                    {t(item.catKey)}
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', color:'var(--ink)', lineHeight:1.3, marginBottom:'6px' }}>
                    {t(item.titleKey)}
                  </div>
                  {isTall && <p style={{ fontSize:'0.75rem', color:'var(--ink-light)', lineHeight:1.5, margin:0 }}>{t(item.descKey).slice(0,80)}…</p>}
                </div>
                <div style={{ height:'4px', background:`linear-gradient(90deg,${item.color},transparent)` }}/>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {selected && (
          <div className="overlay-backdrop" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:'600px', overflow:'hidden', padding:0 }}>
              <div style={{ height:'240px', background:`linear-gradient(135deg,${selected.color}22,${selected.color}08)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <div style={{ fontSize:'6rem', animation:'float 3s ease-in-out infinite', filter:`drop-shadow(0 8px 24px ${selected.color}44)` }}>{selected.icon}</div>
                <div style={{ position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', background:selected.color+'22', border:`2px solid ${selected.color}55`, borderRadius:'var(--r-pill)', padding:'4px 16px', fontSize:'0.85rem', fontWeight:700, color:selected.color }}>
                  {selected.year}
                </div>
              </div>
              <div style={{ padding:'var(--sp-6) var(--sp-8)' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:selected.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>
                  {t(selected.catKey)}
                </div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--ink)', marginBottom:'var(--sp-4)', lineHeight:1.2 }}>
                  {t(selected.titleKey)}
                </h2>
                <p style={{ color:'var(--ink-mid)', lineHeight:1.75, fontSize:'0.95rem' }}>
                  {t(selected.descKey)}
                </p>
                <div style={{ marginTop:'var(--sp-5)', display:'flex', justifyContent:'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>{t('gallery.close')}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
