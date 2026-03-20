// src/components/auth/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth }        from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LangContext';

const STICKERS = [
  { emoji:'🎉', top:'8%',  left:'6%',  size:'3rem',   speed:'4s',   delay:'0s'   },
  { emoji:'🌟', top:'15%', right:'8%', size:'2.2rem', speed:'3.5s', delay:'0.5s' },
  { emoji:'🦁', top:'70%', left:'4%',  size:'2.5rem', speed:'5s',   delay:'1s'   },
  { emoji:'🏺', top:'75%', right:'6%', size:'2rem',   speed:'4.2s', delay:'0.8s' },
  { emoji:'📚', top:'40%', left:'2%',  size:'2rem',   speed:'3.8s', delay:'1.5s' },
  { emoji:'🚀', top:'30%', right:'3%', size:'2.2rem', speed:'4.5s', delay:'0.3s' },
];

const FIELD_META = [
  { key:'username', type:'text',     icon:'👤', label:'auth.username' },
  { key:'password', type:'password', icon:'🔒', label:'auth.password' },
  { key:'confirm',  type:'password', icon:'✅', label:'auth.confirm'  },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const { t }      = useTranslation();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ username:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match! 🙈'); return; }
    setLoading(true);
    const result = await signup(form.username, form.password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.message || 'Signup failed');
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
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'5px', background:'repeating-linear-gradient(90deg,var(--coral) 0,var(--coral) 16px,var(--yellow) 16px,var(--yellow) 32px,var(--sky) 32px,var(--sky) 48px,var(--green-mid) 48px,var(--green-mid) 64px)', borderRadius:'var(--r-2xl) var(--r-2xl) 0 0', opacity:0.7 }}/>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'var(--sp-7)', marginTop:'var(--sp-2)' }}>
          <div className="anim-float" style={{ fontSize:'4rem', marginBottom:'var(--sp-3)', filter:'drop-shadow(0 6px 20px rgba(255,107,107,0.3))' }}>🎊</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', fontWeight:800, color:'var(--ink)', marginBottom:'var(--sp-2)' }}>
            {t('auth.signup.title')}
          </h1>
          <p style={{ color:'var(--ink-light)', fontSize:'0.9rem' }}>{t('auth.signup.sub')}</p>
        </div>

        {/* Benefits strip */}
        <div style={{ display:'flex', justifyContent:'center', gap:'var(--sp-3)', marginBottom:'var(--sp-6)', flexWrap:'wrap' }}>
          {['🆓 Free','💾 Save Progress','🗺️ Map Challenge','🏆 Compete'].map(tag => (
            <span key={tag} style={{ background:'var(--green-bg)', border:'2px solid var(--green-light)', borderRadius:'var(--r-pill)', padding:'3px 12px', fontSize:'0.7rem', fontWeight:800, color:'var(--green-mid)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'var(--sp-4)' }}>
          {FIELD_META.map(({ key, type, icon, label }) => (
            <div key={key}>
              <label style={{ display:'block', fontSize:'0.8rem', fontWeight:800, color:'var(--ink-mid)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {icon} {t(label)}
              </label>
              <input
                className="input"
                type={type}
                placeholder={t(label)}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                required
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

          <button type="submit" className="btn btn-coral btn-lg" disabled={loading}
            style={{ marginTop:'var(--sp-2)', width:'100%', fontSize:'1rem' }}>
            {loading ? '⏳ Creating account...' : `✨ ${t('auth.signup.btn')}`}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'var(--sp-5)', fontSize:'0.88rem', color:'var(--ink-light)' }}>
          <Link to="/login" style={{ color:'var(--green-mid)', fontWeight:800, textDecoration:'underline', textDecorationStyle:'wavy', textDecorationColor:'var(--green-light)', textUnderlineOffset:'4px' }}>
            {t('auth.switch.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
