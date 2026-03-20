// src/components/common/Footer.jsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LangContext';

export default function Footer() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const col1 = [
    { label:`🏠 ${t('nav.home')}`,     to:'/' },
    { label:`⏳ ${t('nav.timeline')}`, to:'/timeline' },
    { label:`🦸 ${t('nav.people')}`,   to:'/people' },
  ];
  const col2 = [
    { label:`🎮 ${t('nav.games')}`,    to:'/games' },
    { label:`📊 ${t('nav.facts')}`,    to:'/facts' },
    { label:`🖼️ ${t('nav.gallery')}`,  to:'/gallery' },
  ];

  const linkStyle = { fontSize:'0.88rem', color:'var(--ink-mid)', cursor:'pointer', fontWeight:600, transition:'color 0.15s ease' };

  return (
    <footer style={{ background:'var(--bg-surface)', borderTop:'4px solid var(--border)', marginTop:'auto' }}>
      <div style={{ height:'5px', background:'repeating-linear-gradient(90deg,var(--green-mid) 0,var(--green-mid) 16px,var(--yellow) 16px,var(--yellow) 32px,var(--coral) 32px,var(--coral) 48px,var(--sky) 48px,var(--sky) 64px)', opacity:0.7 }}/>

      <div style={{ padding:'var(--sp-10) var(--sp-8)', maxWidth:'1300px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'var(--sp-8)', marginBottom:'var(--sp-8)' }}>

          {/* Brand */}
          <div>
            <div onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:'10px', fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'var(--green)', cursor:'pointer', marginBottom:'var(--sp-3)', transition:'transform 0.2s var(--bounce)' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.04) rotate(-1deg)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <span style={{ fontSize:'2rem', animation:'float 3s ease-in-out infinite' }}>🇩🇿</span>
              Algeria Quest
            </div>
            <p style={{ fontSize:'0.87rem', color:'var(--ink-light)', lineHeight:1.7, maxWidth:'280px', marginBottom:'var(--sp-4)' }}>
              {t('footer.desc')} — Preserving the memory of <strong style={{ color:'var(--coral)' }}>1.5 million martyrs</strong> for future generations. 🕊️
            </p>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {[t('footer.tag.free'), t('footer.tag.alg'), t('footer.tag.fun')].map(tag => (
                <span key={tag} style={{ background:'var(--bg-raised)', border:'2px solid var(--border-mid)', borderRadius:'var(--r-pill)', padding:'3px 12px', fontSize:'0.72rem', fontWeight:700, color:'var(--ink-mid)' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:800, color:'var(--ink)', marginBottom:'var(--sp-4)' }}>{t('footer.explore')}</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
              {col1.map(l => (
                <li key={l.to}><span style={linkStyle} onClick={() => navigate(l.to)}
                  onMouseEnter={e => e.currentTarget.style.color='var(--green-mid)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--ink-mid)'}>{l.label}</span></li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:800, color:'var(--ink)', marginBottom:'var(--sp-4)' }}>{t('footer.more')}</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
              {col2.map(l => (
                <li key={l.to}><span style={linkStyle} onClick={() => navigate(l.to)}
                  onMouseEnter={e => e.currentTarget.style.color='var(--green-mid)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--ink-mid)'}>{l.label}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'3px dashed var(--border)', paddingTop:'var(--sp-5)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--sp-3)' }}>
          <div style={{ fontSize:'0.82rem', color:'var(--ink-light)' }}>{t('footer.copyright')}</div>
          <div style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--green)' }}>{t('footer.made')}</div>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            {[t('footer.revolution'), t('footer.martyrs'), t('footer.independence')].map(tag => (
              <span key={tag} style={{ fontSize:'0.75rem', color:'var(--ink-faint)', fontWeight:700 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
