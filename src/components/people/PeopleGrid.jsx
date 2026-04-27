
import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useTranslation }      from '../../i18n/LangContext';
import { collection, getDocs } from 'firebase/firestore';
import { db }                  from '../../firebase';

const STATIC_PEOPLE = [
  { id:'dey-hussein',     name:'Dey Hussein',           nameAr:'الداي حسين',         era:'Resistance', icon:'⚔️' },
  { id:'abdelkader',      name:'Emir Abdelkader',       nameAr:'الأمير عبد القادر',   era:'Resistance', icon:'🏇' },
  { id:'ahmed-bey',       name:'Ahmed Bey',             nameAr:'أحمد باي',           era:'Resistance', icon:'🏰' },
  { id:'messali',         name:'Messali Hadj',          nameAr:'مصالي الحاج',        era:'Revolution', icon:'✊' },
  { id:'ben-badis',       name:'Abdelhamid Ben Badis',  nameAr:'عبد الحميد بن باديس', era:'Medieval',   icon:'📖' }, 
  { id:'ben-boulaïd',     name:'Mostefa Ben Boulaïd',   nameAr:'مصطفى بن بولعيد',   era:'Revolution', icon:'💥' },
  { id:'boudiaf',         name:'Mohamed Boudiaf',       nameAr:'محمد بوضياف',        era:'Revolution', icon:'🌟' },
];

const STATIC_BIOS = {
  'dey-hussein': { 
    born:'1765', died:'1838', 
    bio:`The last Dey of Algiers, Hussein Pasha ruled during the fateful French invasion of 1830. Known for the "Fan Affair," he defended Algiers with dignity before being forced into exile, marking the beginning of a 132-year resistance struggle.` 
  },
  'abdelkader': { 
    born:'1808', died:'1883', 
    bio:`A scholar, poet, and military genius, the Emir led the resistance against French invasion for 15 years. He is recognized globally as the founder of the modern Algerian state and a pioneer of human rights.` 
  },
  'ahmed-bey': { 
    born:'1786', died:'1850', 
    bio:`The Bey of Constantine who led a fierce and sophisticated resistance in eastern Algeria. He famously defeated the French at the first siege of Constantine in 1836, defending the city with strategic brilliance.` 
  },
  'messali': { 
    born:'1898', died:'1974', 
    bio:`Widely considered the father of Algerian nationalism, Messali Hadj founded the first movements calling for total independence. He dedicated his life to organizing the Algerian people's political consciousness.` 
  },
  'ben-badis': { 
    born:'1889', died:'1940', 
    bio:`Leader of the Islamic Reform movement and founder of the Association of Algerian Muslim Ulema. His famous slogan "Islam is our religion, Arabic is our language, Algeria is our fatherland" preserved the nation's identity.` 
  },
  'ben-boulaïd': { 
    born:'1917', died:'1956', 
    bio:`Known as the "Father of the Revolution," Ben Boulaïd was a founding member of the CRUA and the first commander of Wilaya I (Aurès). He was a master of guerrilla warfare and a unifying force for the FLN.` 
  },
  'boudiaf': { 
    born:'1919', died:'1992', 
    bio:`One of the revolutionary "group of six" who launched the 1954 war. After independence and years of exile, he returned as President in 1992 to lead the country through its most difficult transition before his tragic martyrdom.` 
  }
};

const ERA_META = {
  Resistance: { color:'#E11D48', bg:'#FFF1F2', badgeColor:'#BE123C', border:'#FECDD3' }, 
  Revolution: { color:'#2563EB', bg:'#EFF6FF', badgeColor:'#1D4ED8', border:'#DBEAFE' },
  Medieval:   { color:'#D97706', bg:'#FFFBEB', badgeColor:'#B45309', border:'#FEF3C7' }, 
  Islamic:    { color:'#059669', bg:'#ECFDF5', badgeColor:'#047857', border:'#D1FAE5' },
};

const ERAS = ['All', ...Object.keys(ERA_META)];

function mergePeople(staticList, firestoreList) {
  const map = {};
  staticList.forEach(p  => { map[p.id] = { ...p }; });
  firestoreList.forEach(p => { map[p.id] = { ...map[p.id], ...p }; });
  firestoreList.forEach(p => { if (!map[p.id]) map[p.id] = p; });
  return Object.values(map);
}


export default function PeopleGrid() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const [filter, setFilter] = useState('All');
  const [people, setPeople] = useState(STATIC_PEOPLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'people'))
      .then(snap => {
        const fsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPeople(mergePeople(STATIC_PEOPLE, fsData));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === 'All' ? people : people.filter(p => p.era === filter);

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100vh', padding:'var(--sp-12) var(--sp-8)' }}>
      <div style={{ textAlign:'center', marginBottom:'var(--sp-10)' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'12px', animation:'float 3s ease-in-out infinite' }}>🦸</div>
        <h1 style={{ fontFamily:'var(--font-display)', color:'var(--ink)', fontSize:'clamp(2rem,5vw,3rem)' }}>{t('people.title')}</h1>
        <p style={{ color:'var(--ink-mid)', fontSize:'1.05rem', marginTop:'8px' }}>{t('people.sub')} 🇩🇿</p>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', marginBottom:'var(--sp-8)' }}>
        {ERAS.map(era => (
          <button key={era} onClick={() => setFilter(era)} className={`tl-filter-chip${filter===era?' active':''}`}>
            {era === 'All' ? t('people.all') : era}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--sp-5)', maxWidth:'1100px', margin:'0 auto' }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ background:'var(--bg-raised)', borderRadius:'28px', height:'210px', border:'3px solid var(--border)', animation:'pulse 1.5s ease-in-out infinite', animationDelay:`${i*0.1}s` }}/>
          ))}
        </div>
      )}

      {!loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--sp-5)', maxWidth:'1100px', margin:'0 auto' }}>
          {visible.map((person, idx) => (
            <PersonCard key={person.id} person={person} meta={ERA_META[person.era] || ERA_META.Revolution} idx={idx}
              onClick={() => navigate(`/people/${person.id}`)} t={t}/>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonCard({ person, meta, idx, onClick, t }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} className={`anim-slide-up delay-${Math.min(idx+1,8)}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:hovered?meta.color:'var(--bg-surface)', border:`3px solid ${hovered?meta.color:'var(--border-mid)'}`, borderRadius:'28px', padding:'var(--sp-6)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--sp-3)', textAlign:'center', position:'relative', overflow:'hidden', minHeight:'210px', justifyContent:'center', transition:'all 0.22s var(--spring)', boxShadow:hovered?`0 10px 0 ${meta.color}55,0 16px 40px ${meta.color}33`:'var(--shadow-card)', transform:hovered?'translateY(-8px) scale(1.03)':'translateY(0) scale(1)' }}>
      <div style={{ position:'absolute', top:'10px', right:'10px', background:hovered?'rgba(255,255,255,0.22)':meta.bg, color:hovered?'white':meta.badgeColor, border:`2px solid ${hovered?'rgba(255,255,255,0.35)':meta.border}`, borderRadius:'var(--r-pill)', padding:'2px 10px', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.04em', textTransform:'uppercase' }}>
        {person.era}
      </div>

      <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:hovered?'rgba(255,255,255,0.18)':meta.bg, border:`3px solid ${hovered?'rgba(255,255,255,0.45)':meta.color+'55'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', animation:`float ${3+(idx%3)}s ease-in-out infinite`, flexShrink:0, overflow:'hidden' }}>
        {person.imageUrl
          ? <img src={person.imageUrl} alt={person.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : person.icon
        }
      </div>

      <div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.98rem', lineHeight:1.2, color:hovered?'white':'var(--ink)' }}>{person.name}</div>
        <div style={{ fontFamily:'var(--font-arabic)', fontSize:'0.82rem', marginTop:'4px', direction:'rtl', color:hovered?'rgba(255,255,255,0.75)':'var(--ink-light)' }}>{person.nameAr}</div>
      </div>
      <div style={{ fontSize:'0.75rem', fontWeight:700, color:hovered?'rgba(255,255,255,0.7)':'var(--ink-faint)' }}>{t('people.learn')}</div>
    </div>
  );
}


export function PersonProfile({ personId }) {
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [person, setPerson]       = useState(null);
  const [bio,    setBio]          = useState(null);
  const [loading, setLoading]     = useState(true);
  const audioRef                  = useRef(null);

  useEffect(() => {
    const staticP = STATIC_PEOPLE.find(p => p.id === personId);
    const staticB = STATIC_BIOS[personId];

    getDocs(collection(db, 'people'))
      .then(snap => {
        const fsDoc = snap.docs.find(d => d.id === personId);
        const fsData = fsDoc ? { id: fsDoc.id, ...fsDoc.data() } : {};
        setPerson({ ...staticP, ...fsData });
        setBio({ ...staticB, ...fsData });
      })
      .catch(() => { setPerson(staticP); setBio(staticB); })
      .finally(() => setLoading(false));
  }, [personId]);

  const meta = ERA_META[person?.era] || ERA_META.Revolution;

  const togglePlay = () => {
    if (!person?.audioUrl) return;
    if (!audioRef.current) audioRef.current = new Audio(person.audioUrl);
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); audioRef.current.onended = () => setIsPlaying(false); }
  };

  if (loading) return (
    <div style={{ background:'var(--bg-page)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:'3rem', animation:'float 2s ease-in-out infinite' }}>⏳</div>
    </div>
  );

  if (!person) return (
    <div style={{ padding:'48px', textAlign:'center', background:'var(--bg-page)', minHeight:'100vh' }}>
      <div style={{ fontSize:'4rem' }}>🤔</div>
      <h2 style={{ fontFamily:'var(--font-display)', color:'var(--ink)', marginTop:'16px' }}>{t('people.notfound')}</h2>
      <button className="btn btn-green" style={{ marginTop:'24px' }} onClick={() => navigate('/people')}>← {t('people.back.all')}</button>
    </div>
  );

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'100vh', padding:'var(--sp-10) var(--sp-8)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/people')} style={{ marginBottom:'var(--sp-6)' }}>
        {t('people.back')}
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'var(--sp-8)', maxWidth:'1000px', margin:'0 auto' }}>

        <div style={{ background:`linear-gradient(135deg,${meta.color},${meta.color}bb)`, borderRadius:'var(--r-2xl)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'var(--sp-10)', gap:'var(--sp-4)', boxShadow:`0 8px 0 ${meta.color}55,0 16px 40px ${meta.color}33`, minHeight:'380px' }}>
          <div style={{ width:'120px', height:'120px', borderRadius:'50%', border:'4px solid rgba(255,255,255,0.4)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', animation:'float 4s ease-in-out infinite', background:'rgba(255,255,255,0.1)' }}>
            {person.imageUrl
              ? <img src={person.imageUrl} alt={person.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : person.icon
            }
          </div>
          <div style={{ background:'rgba(255,255,255,0.18)', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'var(--r-lg)', padding:'var(--sp-3) var(--sp-5)', color:'white', fontFamily:'var(--font-display)', fontSize:'0.9rem', backdropFilter:'blur(8px)', textAlign:'center' }}>
            <div>🗓️ {bio?.born ?? '?'} – {bio?.died ?? '?'}</div>
            <div style={{ opacity:0.8, fontSize:'0.8rem', marginTop:'4px' }}>{person.era} {t('people.era')}</div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-5)' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'var(--ink)', lineHeight:1.2 }}>{person.name}</h1>
            <div style={{ fontFamily:'var(--font-arabic)', fontSize:'1.1rem', color:'var(--ink-light)', direction:'rtl', marginTop:'4px' }}>{person.nameAr}</div>
          </div>

          {person.audioUrl && (
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <button onClick={togglePlay} style={{ background:meta.color, border:'none', borderRadius:'50%', width:'48px', height:'48px', cursor:'pointer', color:'white', fontSize:'1.2rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 0 ${meta.color}88`, transition:'all 0.15s var(--bounce)', flexShrink:0 }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div className={`audio-wave${isPlaying?'':' paused'}`}>{[1,2,3,4,5,6].map(i=><div key={i} className="bar"/>)}</div>
              <span style={{ fontSize:'0.85rem', color:'var(--ink-light)', fontWeight:600 }}>{isPlaying ? t('people.playing') : t('people.listen')}</span>
            </div>
          )}

          <div style={{ background:'var(--bg-surface)', border:'3px solid var(--border)', borderRadius:'var(--r-xl)', padding:'var(--sp-6)', boxShadow:'var(--shadow-card)', lineHeight:1.85, color:'var(--ink-mid)', fontSize:'0.94rem' }}>
            {bio?.bio || person.bio || t('people.bio.fallback')}
          </div>

          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            <span className="badge badge-green">🏛️ {person.era}</span>
            <span className="badge badge-sky">{t('people.badges.algeria')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
