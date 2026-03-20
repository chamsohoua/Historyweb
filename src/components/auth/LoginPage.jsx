// src/components/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth }        from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LangContext';

/* Floating stickers for auth pages */
const STICKERS = [
  { emoji:'🇩🇿', top:'8%',  left:'6%',  size:'3rem',   speed:'4s',   delay:'0s'   },
  { emoji:'📜',  top:'15%', right:'8%', size:'2.2rem', speed:'3.5s', delay:'0.5s' },
  { emoji:'🌴',  top:'70%', left:'4%',  size:'2.5rem', speed:'5s',   delay:'1s'   },
  { emoji:'⭐',  top:'75%', right:'6%', size:'2rem',   speed:'4.2s', delay:'0.8s' },
  { emoji:'🏺',  top:'40%', left:'2%',  size:'2rem',   speed:'3.8s', delay:'1.5s' },
  { emoji:'🌙',  top:'30%', right:'3%', size:'2.2rem', speed:'4.5s', delay:'0.3s' },
];

export default function LoginPage() {
  const { login }  = useAuth();
  const { t }      = useTranslation();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) navigate(result.isAdmin ? '/admin' : '/');
    else setError(result.message || 'Login failed');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-hero)', padding: 'var(--sp-8)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Dot grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(26,143,79,0.07) 1.5px,transparent 1.5px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>

      {/* Floating stickers */}
      {STICKERS.map((s, i) => (
        <div key={i} style={{ position:'absolute', top:s.top, left:s.left, right:s.right, fontSize:s.size, animation:`float ${s.speed} ease-in-out infinite`, animationDelay:s.delay, pointerEvents:'none', userSelect:'none', filter:'drop-shadow(2px 4px 8px rgba(0,0,0,0.12))' }}>
          {s.emoji}
        </div>
      ))}

      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}
        style={{ position:'absolute', top:'20px', left:'20px', zIndex:2 }}>
        ← Back
      </button>

      {/* Card */}
      <div className="anim-bounce-in" style={{
        background:   'var(--bg-surface)',
        border:       '3px solid var(--border-mid)',
        borderRadius: 'var(--r-2xl)',
        padding:      'var(--sp-10)',
        width:        '100%',
        maxWidth:     '440px',
        boxShadow:    'var(--shadow-hover)',
        position:     'relative',
        zIndex:       1,
      }}>
        {/* Rainbow top strip */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'5px', background:'repeating-linear-gradient(90deg,var(--green-mid) 0,var(--green-mid) 16px,var(--yellow) 16px,var(--yellow) 32px,var(--coral) 32px,var(--coral) 48px,var(--sky) 48px,var(--sky) 64px)', borderRadius:'var(--r-2xl) var(--r-2xl) 0 0', opacity:0.7 }}/>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'var(--sp-7)', marginTop:'var(--sp-2)' }}>
          <div className="anim-float" style={{ fontSize:'4rem', marginBottom:'var(--sp-3)', filter:'drop-shadow(0 6px 20px rgba(0,98,51,0.25))' }}>🇩🇿</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', fontWeight:800, color:'var(--ink)', marginBottom:'var(--sp-2)' }}>
            {t('auth.login.title')}
          </h1>
          <p style={{ color:'var(--ink-light)', fontSize:'0.9rem' }}>{t('auth.login.sub')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'var(--sp-4)' }}>
          {[['username','text','👤'],['password','password','🔒']].map(([k, type, icon]) => (
            <div key={k}>
              <label style={{ display:'block', fontSize:'0.8rem', fontWeight:800, color:'var(--ink-mid)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {icon} {t(`auth.${k}`)}
              </label>
              <input
                className="input"
                type={type}
                placeholder={t(`auth.${k}`)}
                value={form[k]}
                onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                required
                autoFocus={k === 'username'}
              />
            </div>
          ))}

          {error && (
            <div className="anim-wobble" style={{
              background:'var(--coral-bg)', border:'2.5px solid var(--coral-light)',
              borderRadius:'var(--r-md)', padding:'10px 14px',
              fontSize:'0.85rem', color:'var(--coral-dark)', fontWeight:700,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-green btn-lg" disabled={loading}
            style={{ marginTop:'var(--sp-2)', width:'100%', fontSize:'1rem' }}>
            {loading ? '⏳ Logging in...' : `🚀 ${t('auth.login.btn')}`}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'var(--sp-5) 0', color:'var(--ink-faint)', fontSize:'0.8rem', fontWeight:700 }}>
          <div style={{ flex:1, height:'2px', background:'var(--border)' }}/> or <div style={{ flex:1, height:'2px', background:'var(--border)' }}/>
        </div>

        <button className="btn btn-ghost" style={{ width:'100%' }} onClick={() => navigate('/')}>
          👀 {t('auth.guest')}
        </button>

        <p style={{ textAlign:'center', marginTop:'var(--sp-5)', fontSize:'0.88rem', color:'var(--ink-light)' }}>
          <Link to="/signup" style={{ color:'var(--green-mid)', fontWeight:800, textDecoration:'underline', textDecorationStyle:'wavy', textDecorationColor:'var(--green-light)', textUnderlineOffset:'4px' }}>
            {t('auth.switch.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
