// src/components/people/PeopleGrid.jsx
// Reads people from Firestore (admin-managed) and merges with static fallbacks
import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useTranslation }      from '../../i18n/LangContext';
import { collection, getDocs } from 'firebase/firestore';
import { db }                  from '../../firebase';

// ── Static fallback data (shown if Firestore is empty / offline) ──
const STATIC_PEOPLE = [
  { id:'massinissa',      name:'Massinissa',          nameAr:'ماسينيسا',          era:'Numidia',    icon:'👑' },
  { id:'jugurtha',        name:'Jugurtha',             nameAr:'يوغرطة',            era:'Numidia',    icon:'⚔️' },
  { id:'kahina',          name:'Al-Kahina',            nameAr:'الكاهنة',           era:'Islamic',    icon:'🔮' },
  { id:'okba',            name:'Okba Ibn Nafi',        nameAr:'عقبة بن نافع',      era:'Islamic',    icon:'☪️' },
  { id:'abdelkader',      name:'Emir Abdelkader',      nameAr:'الأمير عبد القادر', era:'Resistance', icon:'🏇' },
  { id:'fatma-nsumer',    name:"Fatma N'Soumer",       nameAr:'فاطمة نسومر',       era:'Resistance', icon:'💪' },
  { id:'messali',         name:'Messali Hadj',         nameAr:'مصالي الحاج',       era:'Revolution', icon:'✊' },
  { id:'didouche',        name:'Mourad Didouche',      nameAr:'مراد ديدوش',        era:'Revolution', icon:'🔥' },
  { id:'ben-boulaïd',     name:'Mostefa Ben Boulaïd',  nameAr:'مصطفى بن بولعيد',  era:'Revolution', icon:'💥' },
  { id:'larbi-ben-mhidi', name:"Larbi Ben M'hidi",     nameAr:'العربي بن مهيدي',  era:'Revolution', icon:'🌟' },
  { id:'hassiba',         name:'Hassiba Ben Bouali',   nameAr:'حسيبة بن بوعلي',   era:'Revolution', icon:'🌸' },
  { id:'ibn-khaldoun',    name:'Ibn Khaldoun',         nameAr:'ابن خلدون',         era:'Medieval',   icon:'📚' },
];

const STATIC_BIOS = {
  massinissa: { born:'238 BC', died:'148 BC', bio:`Massinissa was the greatest of the Numidian kings, ruling for over 54 years and transforming the Berber tribes of North Africa into a powerful, unified kingdom. Born around 238 BC, he was a master strategist and diplomat who allied with Rome against Carthage during the Second Punic War. His victory at the Battle of Zama in 202 BC, alongside Scipio Africanus, changed the course of Mediterranean history. Massinissa transformed Numidia into an agricultural powerhouse and built magnificent cities including the capital Cirta.` },
  jugurtha:   { born:'160 BC', died:'104 BC', bio:`Jugurtha was the Numidian king who challenged Rome's expansion into North Africa. He bribed Roman senators, waged guerrilla warfare in the desert, and frustrated Rome for over 15 years. His struggle, known as the Jugurthine War, became a symbol of African resistance against foreign domination. He was ultimately betrayed and executed in Rome.` },
  kahina:     { born:'~640 AD', died:'~703 AD', bio:`Al-Kahina (Dihya) was a Berber queen and prophetess who led powerful resistance against the Arab Umayyad conquest of North Africa. Her name means "the priestess" or "the diviner." She united Berber tribes and inflicted a major defeat on the Arab general Hassan ibn al-Nu'man around 688 AD. Though ultimately defeated, she remains a powerful symbol of Amazigh identity and resistance.` },
  okba:       { born:'622 AD', died:'683 AD', bio:`Uqba ibn Nafi al-Fihri was the Arab general and companion of the Prophet who led the Islamic conquest of North Africa. He founded the city of Kairouan in Tunisia (670 AD), one of Islam's oldest cities. He famously rode his horse into the Atlantic Ocean declaring there were no more lands to conquer for Islam. He was killed in a Berber ambush near Biskra, Algeria.` },
  abdelkader: { born:'1808', died:'1883', bio:`Emir Abdelkader El Djezairi was a scholar, poet, and military commander who led the Algerian resistance against the French invasion from 1832 to 1847. He organized a sophisticated state with its own government, army, and tax system. His military genius frustrated French forces for 15 years. He famously protected Christians during the 1860 Damascus riots, earning international admiration. The United States named a city in his honor: Elkader, Iowa.` },
  'fatma-nsumer': { born:'1830', died:'1863', bio:`Fatma N'Soumer, known as the "Jeanne d'Arc of Kabylia," was a Kabyle religious leader and military commander who led fierce resistance against French colonization in the mountainous region of Kabylia. She rallied thousands of fighters and inspired the population through both spiritual authority and military leadership. Captured in 1857, she died in French custody at age 33.` },
  messali:    { born:'1898', died:'1974', bio:`Messali Hadj (Ahmed Messali) was one of Algeria's founding nationalist leaders. He founded the Étoile Nord-Africaine (1926), the first explicitly pro-independence organization for North Africans, and later the PPA and MTLD parties. Though controversial for his rivalry with the FLN's leadership, he is widely recognized as the "father of Algerian nationalism."` },
  didouche:   { born:'1927', died:'1955', bio:`Mourad Didouche was one of the nine historic founders of the FLN who launched the Algerian Revolution on November 1, 1954. He commanded the northeastern Constantine zone (Wilaya II). Just 27 years old, he was killed in combat near Condé-Smendou in January 1955, becoming one of the revolution's earliest martyrs.` },
  'ben-boulaïd': { born:'1917', died:'1956', bio:`Mostefa Ben Boulaïd was one of the founding nine leaders of the FLN revolution. He commanded the Aurès region (Wilaya I), the heartland of the revolution's first battles on November 1, 1954. A farmer and former sergeant in the French army, he became a legendary guerrilla commander. He was killed in March 1956 when a booby-trapped radio exploded.` },
  'larbi-ben-mhidi': { born:'1923', died:'1957', bio:`Mohamed Larbi Ben M'hidi was one of the FLN's most charismatic and principled leaders. He commanded the Oran region, co-organized the Soummam Congress of 1956, and directed the urban operations of the Battle of Algiers. Captured by French paratroopers in February 1957, he was secretly executed. His famous quote: "Throw the revolution into the streets and let the people carry it."` },
  hassiba:    { born:'1938', died:'1957', bio:`Hassiba Ben Bouali was a young FLN militant who became a legendary figure of the Battle of Algiers. She was a member of the FLN's bomb network in Algiers and sheltered the FLN commander Ali La Pointe in the Casbah. She was killed along with Ali La Pointe when French soldiers exploded the hidden shelter on October 8, 1957. She was only 19 years old.` },
  'ibn-khaldoun': { born:'1332', died:'1406', bio:`Ibn Khaldoun (Abu Zayd Abd ar-Rahman ibn Muhammad ibn Khaldun) was born in Tunis of Andalusian-Algerian heritage. He is considered the father of historiography, sociology, and economics. His monumental work the "Muqaddimah" (1377) pioneered the scientific study of history and society. He served as a diplomat and judge in North Africa and Egypt, and is one of the greatest intellectuals in human history.` },
};

const ERA_META = {
  Numidia:    { color:'#7C3AED', bg:'var(--purple-bg)', badgeColor:'var(--purple)',     border:'var(--purple-light)' },
  Islamic:    { color:'#059669', bg:'var(--green-bg)',  badgeColor:'var(--green-mid)',  border:'var(--green-light)'  },
  Medieval:   { color:'#92400E', bg:'var(--yellow-bg)', badgeColor:'#92400E',           border:'var(--yellow)'       },
  Resistance: { color:'#DC2626', bg:'var(--coral-bg)',  badgeColor:'var(--coral-dark)', border:'var(--coral-light)'  },
  Revolution: { color:'#1D4ED8', bg:'var(--sky-bg)',    badgeColor:'var(--sky-dark)',   border:'var(--sky-light)'    },
};

const ERAS = ['All', ...Object.keys(ERA_META)];

// ── Merge Firestore data over static fallbacks ────────────────
function mergePeople(staticList, firestoreList) {
  const map = {};
  staticList.forEach(p  => { map[p.id] = { ...p }; });
  firestoreList.forEach(p => { map[p.id] = { ...map[p.id], ...p }; });
  // Also include Firestore-only people (admin added new ones)
  firestoreList.forEach(p => { if (!map[p.id]) map[p.id] = p; });
  return Object.values(map);
}

// ══════════════════════════════════════════════════════════
// PEOPLE GRID
// ══════════════════════════════════════════════════════════
export default function PeopleGrid() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const [filter, setFilter] = useState('All');
  const [people, setPeople] = useState(STATIC_PEOPLE);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore people and merge
  useEffect(() => {
    getDocs(collection(db, 'people'))
      .then(snap => {
        const fsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPeople(mergePeople(STATIC_PEOPLE, fsData));
      })
      .catch(() => {/* offline: use static */})
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

      {/* Era filter chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', marginBottom:'var(--sp-8)' }}>
        {ERAS.map(era => (
          <button key={era} onClick={() => setFilter(era)} className={`tl-filter-chip${filter===era?' active':''}`}>
            {era === 'All' ? t('people.all') : era}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--sp-5)', maxWidth:'1100px', margin:'0 auto' }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ background:'var(--bg-raised)', borderRadius:'28px', height:'210px', border:'3px solid var(--border)', animation:'pulse 1.5s ease-in-out infinite', animationDelay:`${i*0.1}s` }}/>
          ))}
        </div>
      )}

      {/* Grid */}
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
      {/* Era badge */}
      <div style={{ position:'absolute', top:'10px', right:'10px', background:hovered?'rgba(255,255,255,0.22)':meta.bg, color:hovered?'white':meta.badgeColor, border:`2px solid ${hovered?'rgba(255,255,255,0.35)':meta.border}`, borderRadius:'var(--r-pill)', padding:'2px 10px', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.04em', textTransform:'uppercase' }}>
        {person.era}
      </div>

      {/* Avatar: Firestore image OR emoji */}
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

// ══════════════════════════════════════════════════════════
// PERSON PROFILE — merges Firestore data with static bio
// ══════════════════════════════════════════════════════════
export function PersonProfile({ personId }) {
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [person, setPerson]       = useState(null);
  const [bio,    setBio]          = useState(null);
  const [loading, setLoading]     = useState(true);
  const audioRef                  = useRef(null);

  useEffect(() => {
    // Try Firestore first, merge with static
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

        {/* Left: portrait */}
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

        {/* Right: info */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-5)' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'var(--ink)', lineHeight:1.2 }}>{person.name}</h1>
            <div style={{ fontFamily:'var(--font-arabic)', fontSize:'1.1rem', color:'var(--ink-light)', direction:'rtl', marginTop:'4px' }}>{person.nameAr}</div>
          </div>

          {/* Audio player — only shown if audioUrl exists */}
          {person.audioUrl && (
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <button onClick={togglePlay} style={{ background:meta.color, border:'none', borderRadius:'50%', width:'48px', height:'48px', cursor:'pointer', color:'white', fontSize:'1.2rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 0 ${meta.color}88`, transition:'all 0.15s var(--bounce)', flexShrink:0 }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div className={`audio-wave${isPlaying?'':' paused'}`}>{[1,2,3,4,5,6].map(i=><div key={i} className="bar"/>)}</div>
              <span style={{ fontSize:'0.85rem', color:'var(--ink-light)', fontWeight:600 }}>{isPlaying ? t('people.playing') : t('people.listen')}</span>
            </div>
          )}

          {/* Bio */}
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
