// src/components/admin/AdminDashboard.jsx — Full CMS
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';
import {
  collection, getDocs, setDoc, deleteDoc, doc, serverTimestamp, getDoc,
} from 'firebase/firestore';
import {
  ref as storageRef, uploadBytesResumable, getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../../firebase';
import { timelineEvents as DEFAULT_TIMELINE } from '../../data/timelineData';

// ── helpers ────────────────────────────────────────────────────
const uid = () => (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2,11));

// ── shared mini-styles ─────────────────────────────────────────
const S = {
  card:  { background:'var(--bg-surface)', border:'3px solid var(--border-mid)', borderRadius:'var(--r-xl)', padding:'var(--sp-6)', marginBottom:'var(--sp-6)', boxShadow:'var(--shadow-card)' },
  input: { width:'100%', padding:'10px 14px', background:'var(--bg-raised)', border:'2.5px solid var(--border-mid)', borderRadius:'var(--r-md)', color:'var(--ink)', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', marginTop:'4px', marginBottom:'8px', boxSizing:'border-box' },
  lbl:   { display:'block', fontSize:'0.75rem', fontWeight:800, color:'var(--ink-mid)', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'8px' },
  row:   { display:'flex', gap:'12px', alignItems:'center' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  section: { background:'var(--bg-raised)', border:'2px solid var(--border)', borderRadius:'var(--r-lg)', padding:'var(--sp-5)', marginBottom:'var(--sp-4)' },
};

// ── Image Uploader ─────────────────────────────────────────────
function ImageUploader({ folder, onUploaded, currentUrl, label='Upload Image' }) {
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(currentUrl || '');
  const ref = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const name = `${Date.now()}-${uid()}.${file.name.split('.').pop()}`;
    const task = uploadBytesResumable(storageRef(storage, `${folder}/${name}`), file);
    setUploading(true);
    task.on('state_changed',
      s => setProgress(Math.round(s.bytesTransferred / s.totalBytes * 100)),
      e => { console.error(e); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setPreview(url); setUploading(false); setProgress(0); onUploaded(url);
      }
    );
  };

  return (
    <div>
      {preview && <img src={preview} alt="preview" style={{ width:80, height:80, objectFit:'cover', borderRadius:'var(--r-md)', border:'3px solid var(--border-mid)', marginBottom:8, display:'block' }}/>}
      <div onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor='var(--green-mid)'; }}
        onDragLeave={e => e.currentTarget.style.borderColor='var(--border-mid)'}
        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor='var(--border-mid)'; handleFile(e.dataTransfer.files[0]); }}
        style={{ border:'2.5px dashed var(--border-mid)', borderRadius:'var(--r-md)', padding:'var(--sp-4)', textAlign:'center', cursor:'pointer', fontSize:'0.82rem', color:'var(--ink-light)', fontWeight:600 }}>
        {uploading ? <>Uploading {progress}%… <div style={{ background:'var(--bg-sunken)', borderRadius:'var(--r-pill)', height:6, marginTop:6 }}><div style={{ width:`${progress}%`, height:'100%', background:'var(--green-mid)', borderRadius:'var(--r-pill)' }}/></div></>
          : <>📁 {label} — click or drag</>}
      </div>
      <input ref={ref} type="file" accept="image/*,audio/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])}/>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div style={{ position:'fixed', bottom:'var(--sp-8)', left:'50%', transform:'translateX(-50%)', background:'var(--ink)', color:'white', padding:'12px 28px', borderRadius:'var(--r-pill)', fontFamily:'var(--font-display)', fontWeight:700, zIndex:9999, boxShadow:'0 6px 0 rgba(0,0,0,0.3)', animation:'slideUp 0.4s var(--bounce)', whiteSpace:'nowrap' }}>{msg}</div>;
}

// ── Inline field ───────────────────────────────────────────────
function Field({ label, value, onChange, multiline, rows=3, placeholder='' }) {
  return (
    <div>
      <label style={S.lbl}>{label}</label>
      {multiline
        ? <textarea rows={rows} style={{...S.input, resize:'vertical'}} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
        : <input style={S.input} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout, loading: authLoading } = useAuth();

  const [tab,       setTab]       = useState('homepage');
  const [toast,     setToast]     = useState('');
  const [saving,    setSaving]    = useState(false);

  // Content sections state
  const [homepage,  setHomepage]  = useState(null);
  const [timeline,  setTimeline]  = useState(null);
  const [people,    setPeople]    = useState([]);
  const [facts,     setFacts]     = useState(null);
  const [gallery,   setGallery]   = useState(null);
  const [questions, setQuestions] = useState([]);
  const [users,     setUsers]     = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/login');
  }, [isAdmin, authLoading]);

  // ── Fetch all content ───────────────────────────────────────
  const loadAll = useCallback(async () => {
    setDataLoading(true);
    try {
      const [hmSnap, tlSnap, pSnap, fSnap, gSnap, qSnap, uSnap] = await Promise.all([
        getDoc(doc(db, 'content', 'homepage')),
        getDoc(doc(db, 'content', 'timeline')),
        getDocs(collection(db, 'people')),
        getDoc(doc(db, 'content', 'facts')),
        getDoc(doc(db, 'content', 'gallery')),
        getDocs(collection(db, 'questions')),
        getDocs(collection(db, 'users')),
      ]);

      setHomepage(hmSnap.exists() ? hmSnap.data() : defaultHomepage());
      setTimeline(tlSnap.exists() ? tlSnap.data().events : DEFAULT_TIMELINE.map(e => ({...e})));
      setPeople(pSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      setFacts(fSnap.exists() ? fSnap.data() : null);
      setGallery(gSnap.exists() ? gSnap.data().items : null);
      setQuestions(qSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      setUsers(uSnap.docs.map(d => d.data()));
    } catch(e) { showToast('❌ Firebase error: ' + e.message); }
    setDataLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const saveContent = async (docId, data) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', docId), data, { merge: true });
      showToast('✅ Saved to Firebase!');
    } catch(e) { showToast('❌ ' + e.message); }
    setSaving(false);
  };

  // ── People CRUD ─────────────────────────────────────────────
  const blankP = { id:'', name:'', nameAr:'', era:'Resistance', icon:'👤', imageUrl:'', audioUrl:'', bio:'' };
  const [pForm, setPForm] = useState(blankP);
  const [editP, setEditP] = useState(null);

  const savePerson = async () => {
    const id = pForm.id || uid();
    await setDoc(doc(db, 'people', id), { ...pForm, id, updatedAt: serverTimestamp() });
    showToast('✅ Person saved!'); setPForm(blankP); setEditP(null); loadAll();
  };
  const delPerson = async (id) => {
    if (!confirm('Delete this person?')) return;
    await deleteDoc(doc(db, 'people', id)); showToast('🗑️ Deleted'); loadAll();
  };

  // ── Questions CRUD ──────────────────────────────────────────
  const blankQ = { id:'', type:'mcq', question:'', options:['','','',''], correct:'', target:'' };
  const [qForm, setQForm] = useState(blankQ);
  const [editQ, setEditQ] = useState(null);

  const saveQuestion = async () => {
    const id = qForm.id || uid();
    await setDoc(doc(db, 'questions', id), { ...qForm, id, updatedAt: serverTimestamp() });
    showToast('✅ Question saved!'); setQForm(blankQ); setEditQ(null); loadAll();
  };
  const delQuestion = async (id) => {
    if (!confirm('Delete?')) return;
    await deleteDoc(doc(db, 'questions', id)); showToast('🗑️ Deleted'); loadAll();
  };

  // ── TABS ────────────────────────────────────────────────────
  const TABS = [
    { id:'homepage',  label:'🏠 Home'      },
    { id:'timeline',  label:'⏳ Timeline'  },
    { id:'people',    label:'🦸 Heroes'    },
    { id:'facts',     label:'📊 Facts'     },
    { id:'gallery',   label:'🖼️ Gallery'   },
    { id:'games',     label:'🎮 Games'     },
    { id:'users',     label:'👥 Users'     },
  ];

  if (authLoading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg-page)', fontSize:'3rem' }}>⏳</div>;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-page)', padding:'var(--sp-8)', fontFamily:'var(--font-body)' }}>
      <Toast msg={toast}/>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--sp-6)', flexWrap:'wrap', gap:'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', color:'var(--green)', fontSize:'2rem', marginBottom:4 }}>🛡️ Content Manager</h1>
          <p style={{ color:'var(--ink-light)', fontSize:'0.85rem' }}>All changes save directly to Firebase and go live instantly</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← View Site</button>
          <button className="btn btn-coral btn-sm" onClick={() => { logout(); navigate('/'); }}>👋 Logout</button>
        </div>
      </div>

      {/* Firebase badge */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--green-bg)', border:'2px solid var(--green-light)', borderRadius:'var(--r-pill)', padding:'4px 16px', fontSize:'0.75rem', fontWeight:700, color:'var(--green-mid)', marginBottom:'var(--sp-6)' }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--green-mid)', animation:'pulse 2s infinite', display:'inline-block' }}/>
        Live · Firebase Project: vitevite-201fd
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:'var(--sp-6)', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:tab===t.id?'var(--green)':'var(--bg-surface)', color:tab===t.id?'white':'var(--ink-mid)', border:`2.5px solid ${tab===t.id?'var(--green)':'var(--border-mid)'}`, borderRadius:'var(--r-pill)', padding:'8px 18px', cursor:'pointer', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.85rem', boxShadow:tab===t.id?'0 4px 0 var(--green-dark)':'0 3px 0 var(--border-mid)', transition:'all 0.15s var(--bounce)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {dataLoading
        ? <div style={{ textAlign:'center', padding:'var(--sp-16)', color:'var(--ink-light)' }}><div style={{ fontSize:'3rem', animation:'float 2s ease-in-out infinite' }}>⏳</div><p style={{ marginTop:'var(--sp-4)', fontWeight:700 }}>Loading from Firebase…</p></div>
        : <TabContent tab={tab} homepage={homepage} setHomepage={setHomepage} timeline={timeline} setTimeline={setTimeline} people={people} pForm={pForm} setPForm={setPForm} editP={editP} setEditP={setEditP} blankP={blankP} savePerson={savePerson} delPerson={delPerson} facts={facts} setFacts={setFacts} gallery={gallery} setGallery={setGallery} questions={questions} qForm={qForm} setQForm={setQForm} editQ={editQ} setEditQ={setEditQ} blankQ={blankQ} saveQuestion={saveQuestion} delQuestion={delQuestion} users={users} saveContent={saveContent} saving={saving} showToast={showToast} loadAll={loadAll}/>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB CONTENT ROUTER
// ════════════════════════════════════════════════════════════════
function TabContent(props) {
  switch (props.tab) {
    case 'homepage':  return <HomepageTab  {...props}/>;
    case 'timeline':  return <TimelineTab  {...props}/>;
    case 'people':    return <PeopleTab    {...props}/>;
    case 'facts':     return <FactsTab     {...props}/>;
    case 'gallery':   return <GalleryTab   {...props}/>;
    case 'games':     return <GamesTab     {...props}/>;
    case 'users':     return <UsersTab     {...props}/>;
    default: return null;
  }
}

// ════════════════════════════════════════════════════════════════
// HOMEPAGE TAB
// ════════════════════════════════════════════════════════════════
function defaultHomepage() {
  return {
    heroSub:  'Journey through 200 years of courage, resistance, and glory',
    heroCta:  'Begin the Journey',
    heroCta2: 'Explore the Map',
    featuredTitle: 'Featured Events',
    featuredSub:   'The moments that defined a nation',
    exploreTitle:  'Explore Algeria',
    exploreSub:    'Choose your adventure',
    factsTitle:    'Did You Know?',
    ctaTitle:      "Join the Adventure — It's FREE! 🎉",
    ctaSub:        'Create a free account to save your progress, unlock the Map Challenge!',
    quotes: [
      { text: 'By our revolution, we prove we can govern ourselves.', author: 'Ahmed Ben Bella, 1962' },
      { text: 'We did not take up arms to seize power, but to build a state.', author: 'FLN Declaration, 1954' },
      { text: 'The blood of the martyrs waters the tree of freedom.', author: 'Algerian Proverb' },
      { text: 'A nation that forgets its history is a nation without roots.', author: 'Algerian Wisdom' },
    ],
    facts: [
      { emoji:'🦁', text:"Algeria is home to the Barbary lion, once roaming its Atlas Mountains." },
      { emoji:'🗿', text:"Tassili n'Ajjer has 15,000+ cave paintings — the world's biggest open-air museum!" },
      { emoji:'🌍', text:"Algeria is the LARGEST country in Africa and the 10th biggest in the whole world!" },
      { emoji:'📚', text:"Ibn Khaldoun wrote the world's very first sociology book back in 1377!" },
      { emoji:'🏺', text:'The Roman ruins of Timgad are so well preserved they\'re called the "Pompeii of Africa"!' },
      { emoji:'⭐', text:"Emir Abdelkader was so admired that a whole city in Iowa (USA) is named after him!" },
      { emoji:'🌊', text:"Algeria has 1,200 km of beautiful Mediterranean coastline!" },
      { emoji:'🔥', text:"On November 1, 1954, the FLN launched 70 simultaneous attacks to start the revolution!" },
    ],
    eras: [
      { era:'Ottoman Period',      years:'1516–1830', color:'#D4AF37', events:2,  icon:'🕌' },
      { era:'French Colonization', years:'1830–1954', color:'#FF6B6B', events:10, icon:'⚔️' },
      { era:'The Revolution',      years:'1954–1962', color:'#FF9F43', events:8,  icon:'🔥' },
      { era:'Building the Nation', years:'1962–1988', color:'#4ade80', events:8,  icon:'🏗️' },
      { era:'Democratic Struggle', years:'1988–2000', color:'#9B59B6', events:5,  icon:'✊' },
      { era:'Contemporary Algeria',years:'2000–2026', color:'#4ECDC4', events:4,  icon:'🇩🇿' },
    ],
  };
}

function HomepageTab({ homepage, setHomepage, saveContent, saving }) {
  if (!homepage) return null;
  const set = (key, val) => setHomepage(h => ({ ...h, [key]: val }));

  return (
    <div>
      <div style={S.card}>
        <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)', marginBottom:'var(--sp-5)' }}>🏠 Hero Section</h3>
        <div style={S.grid2}>
          <Field label="Hero Subtitle"  value={homepage.heroSub}  onChange={v => set('heroSub',  v)} placeholder="Journey through 200 years…"/>
          <Field label="CTA Button 1"   value={homepage.heroCta}  onChange={v => set('heroCta',  v)} placeholder="Begin the Journey"/>
          <Field label="CTA Button 2"   value={homepage.heroCta2} onChange={v => set('heroCta2', v)} placeholder="Explore the Map"/>
          <Field label="Featured Title" value={homepage.featuredTitle} onChange={v => set('featuredTitle', v)}/>
          <Field label="Explore Title"  value={homepage.exploreTitle} onChange={v => set('exploreTitle',  v)}/>
          <Field label="Facts Section Title" value={homepage.factsTitle} onChange={v => set('factsTitle', v)}/>
          <Field label="CTA Banner Title" value={homepage.ctaTitle} onChange={v => set('ctaTitle', v)}/>
        </div>
        <Field label="CTA Banner Subtitle" value={homepage.ctaSub} onChange={v => set('ctaSub', v)} multiline rows={2}/>
      </div>

      {/* Quotes */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--sp-4)' }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>💬 Rotating Quotes</h3>
          <button className="btn btn-green btn-sm" onClick={() => set('quotes', [...(homepage.quotes||[]), { text:'', author:'' }])}>+ Add Quote</button>
        </div>
        {(homepage.quotes||[]).map((q, i) => (
          <div key={i} style={S.section}>
            <div style={S.grid2}>
              <Field label={`Quote ${i+1} text`}   value={q.text}   onChange={v => { const arr=[...homepage.quotes]; arr[i]={...arr[i],text:v};   set('quotes',arr); }} multiline rows={2}/>
              <Field label="Author & year"          value={q.author} onChange={v => { const arr=[...homepage.quotes]; arr[i]={...arr[i],author:v}; set('quotes',arr); }}/>
            </div>
            <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)' }} onClick={() => set('quotes', homepage.quotes.filter((_,j)=>j!==i))}>🗑️ Remove</button>
          </div>
        ))}
      </div>

      {/* Did You Know facts */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--sp-4)' }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>💡 "Did You Know?" Facts</h3>
          <button className="btn btn-green btn-sm" onClick={() => set('facts', [...(homepage.facts||[]), { emoji:'⭐', text:'' }])}>+ Add Fact</button>
        </div>
        {(homepage.facts||[]).map((f, i) => (
          <div key={i} style={{ ...S.section, display:'grid', gridTemplateColumns:'80px 1fr auto', gap:12, alignItems:'flex-start' }}>
            <Field label="Emoji" value={f.emoji} onChange={v => { const arr=[...homepage.facts]; arr[i]={...arr[i],emoji:v}; set('facts',arr); }}/>
            <Field label="Fact text" value={f.text} onChange={v => { const arr=[...homepage.facts]; arr[i]={...arr[i],text:v}; set('facts',arr); }} multiline rows={2}/>
            <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)', marginTop:20 }} onClick={() => set('facts', homepage.facts.filter((_,j)=>j!==i))}>🗑️</button>
          </div>
        ))}
      </div>

      {/* Eras */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--sp-4)' }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>📖 Algeria's Story Eras</h3>
          <button className="btn btn-green btn-sm" onClick={() => set('eras', [...(homepage.eras||[]), { era:'New Era', years:'', color:'#4ade80', events:0, icon:'⭐' }])}>+ Add Era</button>
        </div>
        {(homepage.eras||[]).map((e, i) => (
          <div key={i} style={S.section}>
            <div style={{ display:'grid', gridTemplateColumns:'40px 2fr 1fr 60px 60px auto', gap:10, alignItems:'center' }}>
              <div><label style={S.lbl}>Icon</label><input style={S.input} value={e.icon} onChange={v => { const arr=[...homepage.eras]; arr[i]={...arr[i],icon:v.target.value}; set('eras',arr); }}/></div>
              <div><label style={S.lbl}>Era Name</label><input style={S.input} value={e.era}  onChange={v => { const arr=[...homepage.eras]; arr[i]={...arr[i],era:v.target.value};  set('eras',arr); }}/></div>
              <div><label style={S.lbl}>Years</label><input style={S.input} value={e.years} onChange={v => { const arr=[...homepage.eras]; arr[i]={...arr[i],years:v.target.value}; set('eras',arr); }}/></div>
              <div><label style={S.lbl}>Events</label><input type="number" style={S.input} value={e.events} onChange={v => { const arr=[...homepage.eras]; arr[i]={...arr[i],events:parseInt(v.target.value)||0}; set('eras',arr); }}/></div>
              <div><label style={S.lbl}>Color</label><input type="color" style={{ ...S.input, padding:2, height:38, cursor:'pointer' }} value={e.color} onChange={v => { const arr=[...homepage.eras]; arr[i]={...arr[i],color:v.target.value}; set('eras',arr); }}/></div>
              <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)', marginTop:18 }} onClick={() => set('eras', homepage.eras.filter((_,j)=>j!==i))}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-green btn-lg" disabled={saving} onClick={() => saveContent('homepage', homepage)} style={{ width:'100%' }}>
        {saving ? '⏳ Saving…' : '💾 Save All Homepage Changes'}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TIMELINE TAB
// ════════════════════════════════════════════════════════════════
function TimelineTab({ timeline, setTimeline, saveContent, saving }) {
  const [editIdx, setEditIdx] = useState(null);
  const [search,  setSearch]  = useState('');
  const setEv = (i, key, val) => setTimeline(t => { const arr=[...t]; arr[i]={...arr[i],[key]:val}; return arr; });

  const filtered = (timeline||[]).filter(e => e.title?.toLowerCase().includes(search.toLowerCase()) || String(e.year).includes(search));

  const addEvent = () => {
    const newEv = { id:uid(), year:2024, title:'New Event', titleAr:'', short:'', body:'', icon:'📅', color:'#4ade80', category:'modern', era:'Contemporary Algeria', importance:3 };
    setTimeline(t => [...t, newEv]);
    setEditIdx((timeline||[]).length);
  };

  const delEvent = (id) => {
    if (!confirm('Delete this event?')) return;
    setTimeline(t => t.filter(e => e.id !== id));
  };

  const ev = editIdx !== null ? (timeline||[])[editIdx] : null;

  return (
    <div>
      {/* Edit panel */}
      {ev && (
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--sp-4)' }}>
            <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>✏️ Editing: {ev.title}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditIdx(null)}>✕ Close</button>
          </div>
          <div style={S.grid2}>
            <Field label="Year"         value={String(ev.year)}  onChange={v => setEv(editIdx,'year',parseInt(v)||ev.year)}/>
            <Field label="Icon (emoji)" value={ev.icon}          onChange={v => setEv(editIdx,'icon',v)}/>
            <Field label="Title (EN)"   value={ev.title}         onChange={v => setEv(editIdx,'title',v)}/>
            <Field label="Title (AR)"   value={ev.titleAr}       onChange={v => setEv(editIdx,'titleAr',v)}/>
            <Field label="Category"     value={ev.category}      onChange={v => setEv(editIdx,'category',v)}/>
            <Field label="Era"          value={ev.era}           onChange={v => setEv(editIdx,'era',v)}/>
            <div>
              <label style={S.lbl}>Importance (1-5)</label>
              <input type="range" min={1} max={5} value={ev.importance||3} onChange={e => setEv(editIdx,'importance',parseInt(e.target.value))} style={{ width:'100%', marginTop:8 }}/>
              <div style={{ textAlign:'center', fontWeight:800, color:'var(--green-mid)' }}>{ev.importance||3} / 5</div>
            </div>
            <div>
              <label style={S.lbl}>Color</label>
              <input type="color" style={{ ...S.input, padding:2, height:42, cursor:'pointer' }} value={ev.color||'#4ade80'} onChange={e => setEv(editIdx,'color',e.target.value)}/>
            </div>
          </div>
          <Field label="Short description (shown on card)" value={ev.short} onChange={v => setEv(editIdx,'short',v)} multiline rows={2}/>
          <Field label="Full body text (shown in modal)"   value={ev.body}  onChange={v => setEv(editIdx,'body',v)}  multiline rows={5}/>
          <button className="btn btn-green btn-sm" onClick={() => setEditIdx(null)} style={{ marginTop:8 }}>✅ Done editing</button>
        </div>
      )}

      {/* Event list */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--sp-4)', flexWrap:'wrap', gap:10 }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>⏳ Timeline Events ({(timeline||[]).length})</h3>
          <div style={{ display:'flex', gap:10 }}>
            <input style={{ ...S.input, width:200, marginBottom:0, marginTop:0 }} placeholder="🔍 Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            <button className="btn btn-green btn-sm" onClick={addEvent}>+ Add Event</button>
          </div>
        </div>

        <div style={{ maxHeight:500, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map((e, i) => {
            const realIdx = (timeline||[]).findIndex(x => x.id === e.id);
            return (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'var(--bg-raised)', border:'2px solid var(--border)', borderRadius:'var(--r-lg)' }}>
                <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{e.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, color:'var(--ink)', fontSize:'0.9rem' }}>{e.year} — {e.title}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--ink-light)' }}>{e.era} · {e.category}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditIdx(realIdx)}>✏️ Edit</button>
                  <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)' }} onClick={() => delEvent(e.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn btn-green btn-lg" disabled={saving} onClick={() => saveContent('timeline', { events: timeline })} style={{ width:'100%' }}>
        {saving ? '⏳ Saving…' : '💾 Save All Timeline Changes'}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PEOPLE TAB
// ════════════════════════════════════════════════════════════════
function PeopleTab({ people, pForm, setPForm, editP, setEditP, blankP, savePerson, delPerson }) {
  const ERAS = ['Numidia','Islamic','Medieval','Resistance','Revolution'];
  return (
    <div>
      <div style={S.card}>
        <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)', marginBottom:'var(--sp-4)' }}>
          {editP ? '✏️ Edit Hero' : '➕ Add Hero'}
        </h3>
        <div style={S.grid2}>
          <Field label="Name (EN)"   value={pForm.name}   onChange={v => setPForm(f=>({...f,name:v}))} placeholder="Emir Abdelkader"/>
          <Field label="Name (AR)"   value={pForm.nameAr} onChange={v => setPForm(f=>({...f,nameAr:v}))} placeholder="الأمير عبد القادر"/>
          <Field label="Icon (emoji)" value={pForm.icon}  onChange={v => setPForm(f=>({...f,icon:v}))} placeholder="🏇"/>
          <div>
            <label style={S.lbl}>Era</label>
            <select style={{ ...S.input, cursor:'pointer' }} value={pForm.era} onChange={e => setPForm(f=>({...f,era:e.target.value}))}>
              {ERAS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <Field label="Biography" value={pForm.bio} onChange={v => setPForm(f=>({...f,bio:v}))} multiline rows={5} placeholder="Full biography text…"/>
        <div style={S.grid2}>
          <div>
            <label style={S.lbl}>Profile Image → Firebase Storage</label>
            <ImageUploader folder="people-images" currentUrl={pForm.imageUrl} onUploaded={url => setPForm(f=>({...f,imageUrl:url}))} label="Upload Profile Image"/>
          </div>
          <div>
            <label style={S.lbl}>Audio Narration → Firebase Storage</label>
            <ImageUploader folder="people-audio" currentUrl={pForm.audioUrl} onUploaded={url => setPForm(f=>({...f,audioUrl:url}))} label="Upload Audio (MP3/OGG)"/>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:'var(--sp-4)' }}>
          <button className="btn btn-green" onClick={savePerson}>{editP ? '💾 Save Changes' : '✅ Add Hero'}</button>
          {editP && <button className="btn btn-ghost btn-sm" onClick={() => { setPForm(blankP); setEditP(null); }}>Cancel</button>}
        </div>
      </div>

      <div style={S.card}>
        <h3 style={{ fontFamily:'var(--font-display)', marginBottom:'var(--sp-4)', color:'var(--ink)' }}>🦸 Heroes in Firebase ({people.length})</h3>
        {people.length === 0 && <p style={{ color:'var(--ink-light)' }}>No custom heroes yet — static fallbacks are showing on the site.</p>}
        {people.map(p => (
          <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'var(--bg-raised)', border:'2px solid var(--border)', borderRadius:'var(--r-lg)', marginBottom:8 }}>
            {p.imageUrl
              ? <img src={p.imageUrl} alt={p.name} style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'2px solid var(--border-mid)' }}/>
              : <span style={{ fontSize:'2rem', flexShrink:0 }}>{p.icon}</span>}
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:'var(--ink)' }}>{p.name} <span style={{ color:'var(--ink-light)', fontWeight:400, fontSize:'0.8rem' }}>{p.nameAr}</span></div>
              <div style={{ fontSize:'0.75rem', color:'var(--ink-light)' }}>{p.era}</div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPForm(p); setEditP(p.id); }}>✏️ Edit</button>
              <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)' }} onClick={() => delPerson(p.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// FACTS TAB
// ════════════════════════════════════════════════════════════════
function FactsTab({ facts, setFacts, saveContent, saving }) {
  const DEFAULT_CATS = [
    { titleKey:'Geography',           icon:'🌍', color:'#10B981', facts:[] },
    { titleKey:'Population & Society',icon:'👥', color:'#7C3AED', facts:[] },
    { titleKey:'History & Revolution',icon:'🔥', color:'#DC2626', facts:[] },
    { titleKey:'Economy & Energy',    icon:'🛢️', color:'#D97706', facts:[] },
    { titleKey:'Culture & Heritage',  icon:'🏺', color:'#F97316', facts:[] },
  ];
  const cats = facts?.categories || DEFAULT_CATS;
  const setCats = (arr) => setFacts(f => ({ ...(f||{}), categories: arr }));

  return (
    <div>
      {cats.map((cat, ci) => (
        <div key={ci} style={S.card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--sp-4)', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
              <input style={{ ...S.input, width:60, marginBottom:0, marginTop:0 }} value={cat.icon} onChange={e => { const arr=[...cats]; arr[ci]={...arr[ci],icon:e.target.value}; setCats(arr); }}/>
              <input style={{ ...S.input, flex:1, marginBottom:0, marginTop:0 }} value={cat.titleKey} onChange={e => { const arr=[...cats]; arr[ci]={...arr[ci],titleKey:e.target.value}; setCats(arr); }}/>
              <input type="color" style={{ ...S.input, width:48, padding:2, height:38, marginBottom:0, marginTop:0, cursor:'pointer' }} value={cat.color} onChange={e => { const arr=[...cats]; arr[ci]={...arr[ci],color:e.target.value}; setCats(arr); }}/>
            </div>
            <button className="btn btn-green btn-sm" onClick={() => { const arr=[...cats]; arr[ci].facts=[...arr[ci].facts,{label:'',value:'',unit:'',note:''}]; setCats(arr); }}>+ Fact</button>
          </div>
          {cat.facts.map((f, fi) => (
            <div key={fi} style={{ ...S.section, display:'grid', gridTemplateColumns:'1fr 80px 60px 2fr auto', gap:10, alignItems:'flex-start' }}>
              <Field label="Label"  value={f.label} onChange={v => { const arr=[...cats]; arr[ci].facts[fi]={...arr[ci].facts[fi],label:v}; setCats(arr); }}/>
              <Field label="Value"  value={f.value} onChange={v => { const arr=[...cats]; arr[ci].facts[fi]={...arr[ci].facts[fi],value:v}; setCats(arr); }}/>
              <Field label="Unit"   value={f.unit}  onChange={v => { const arr=[...cats]; arr[ci].facts[fi]={...arr[ci].facts[fi],unit:v}; setCats(arr); }}/>
              <Field label="Note"   value={f.note}  onChange={v => { const arr=[...cats]; arr[ci].facts[fi]={...arr[ci].facts[fi],note:v}; setCats(arr); }}/>
              <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)', marginTop:22 }} onClick={() => { const arr=[...cats]; arr[ci].facts=arr[ci].facts.filter((_,j)=>j!==fi); setCats(arr); }}>🗑️</button>
            </div>
          ))}
        </div>
      ))}
      <button className="btn btn-green btn-lg" disabled={saving} onClick={() => saveContent('facts', { categories: cats })} style={{ width:'100%' }}>
        {saving ? '⏳ Saving…' : '💾 Save All Facts Changes'}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// GALLERY TAB
// ════════════════════════════════════════════════════════════════
function GalleryTab({ gallery, setGallery, saveContent, saving }) {
  const CATS = ['Ancient','Architecture','Heroes','Revolution','Independence','Nature','Modern'];
  const items = gallery || [];

  const add = () => setGallery(g => [...(g||[]), { id:uid(), title:'New Item', year:'', category:'Modern', icon:'🖼️', desc:'', color:'#4ade80' }]);
  const del = (i) => setGallery(g => g.filter((_,j) => j!==i));
  const set = (i, key, val) => setGallery(g => { const arr=[...g]; arr[i]={...arr[i],[key]:val}; return arr; });

  return (
    <div>
      <div style={{ ...S.card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)' }}>🖼️ Gallery Items ({items.length})</h3>
        <button className="btn btn-green btn-sm" onClick={add}>+ Add Item</button>
      </div>

      {items.map((item, i) => (
        <div key={item.id||i} style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--sp-3)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:'2rem' }}>{item.icon}</span>
              <strong style={{ fontFamily:'var(--font-display)', color:'var(--ink)' }}>{item.title}</strong>
              <span className="badge badge-green" style={{ fontSize:'0.65rem' }}>{item.category}</span>
            </div>
            <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)' }} onClick={() => del(i)}>🗑️ Remove</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'60px 2fr 1fr 1fr 60px', gap:12 }}>
            <Field label="Icon"     value={item.icon}     onChange={v => set(i,'icon',v)}/>
            <Field label="Title"    value={item.title}    onChange={v => set(i,'title',v)}/>
            <Field label="Year"     value={item.year}     onChange={v => set(i,'year',v)}/>
            <div>
              <label style={S.lbl}>Category</label>
              <select style={{ ...S.input, cursor:'pointer' }} value={item.category} onChange={e => set(i,'category',e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Color</label>
              <input type="color" style={{ ...S.input, padding:2, height:38, cursor:'pointer' }} value={item.color||'#4ade80'} onChange={e => set(i,'color',e.target.value)}/>
            </div>
          </div>
          <Field label="Description" value={item.desc} onChange={v => set(i,'desc',v)} multiline rows={2}/>
        </div>
      ))}

      <button className="btn btn-green btn-lg" disabled={saving} onClick={() => saveContent('gallery', { items })} style={{ width:'100%' }}>
        {saving ? '⏳ Saving…' : '💾 Save All Gallery Changes'}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// GAMES TAB
// ════════════════════════════════════════════════════════════════
function GamesTab({ questions, qForm, setQForm, editQ, setEditQ, blankQ, saveQuestion, delQuestion }) {
  return (
    <div>
      <div style={S.card}>
        <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green)', marginBottom:'var(--sp-4)' }}>
          {editQ ? '✏️ Edit Question' : '➕ Add Quiz Question'}
        </h3>
        <div>
          <label style={S.lbl}>Type</label>
          <select style={{ ...S.input, cursor:'pointer' }} value={qForm.type} onChange={e => setQForm(f=>({...f,type:e.target.value}))}>
            <option value="mcq">MCQ (Multiple Choice)</option>
            <option value="click">Map Click</option>
          </select>
        </div>
        <Field label="Question text" value={qForm.question} onChange={v => setQForm(f=>({...f,question:v}))} multiline rows={3}/>
        {qForm.type === 'mcq' && (
          <>
            {qForm.options.map((opt, i) => (
              <Field key={i} label={`Option ${i+1}`} value={opt} onChange={v => setQForm(f => { const o=[...f.options]; o[i]=v; return {...f,options:o}; })} placeholder={`Option ${i+1}…`}/>
            ))}
            <Field label="Correct answer (must match one option exactly)" value={qForm.correct} onChange={v => setQForm(f=>({...f,correct:v}))}/>
          </>
        )}
        {qForm.type === 'click' && (
          <Field label="Target Wilaya Code (e.g. ALG, ORA)" value={qForm.target} onChange={v => setQForm(f=>({...f,target:v.toUpperCase()}))}/>
        )}
        <div style={{ display:'flex', gap:10, marginTop:'var(--sp-4)' }}>
          <button className="btn btn-green" onClick={saveQuestion}>{editQ ? '💾 Save Changes' : '✅ Add Question'}</button>
          {editQ && <button className="btn btn-ghost btn-sm" onClick={() => { setQForm(blankQ); setEditQ(null); }}>Cancel</button>}
        </div>
      </div>

      <div style={S.card}>
        <h3 style={{ fontFamily:'var(--font-display)', marginBottom:'var(--sp-4)', color:'var(--ink)' }}>❓ Quiz Questions ({questions.length})</h3>
        {questions.length === 0 && <p style={{ color:'var(--ink-light)' }}>No custom questions yet — built-in questions are being used.</p>}
        {questions.map((q, i) => (
          <div key={q.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 14px', background:'var(--bg-raised)', border:'2px solid var(--border)', borderRadius:'var(--r-lg)', marginBottom:8 }}>
            <span className="badge badge-sky" style={{ flexShrink:0, marginTop:2 }}>{q.type}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink)' }}>#{i+1} {q.question}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--ink-light)', marginTop:3 }}>{q.type==='mcq'?`✓ ${q.correct}`:`Target: ${q.target}`}</div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setQForm({...q,options:q.options||['','','','']}); setEditQ(q.id); }}>✏️</button>
              <button className="btn btn-sm" style={{ background:'var(--coral-bg)', color:'var(--coral-dark)', border:'2px solid var(--coral-light)' }} onClick={() => delQuestion(q.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// USERS TAB
// ════════════════════════════════════════════════════════════════
function UsersTab({ users }) {
  return (
    <div style={S.card}>
      <h3 style={{ fontFamily:'var(--font-display)', marginBottom:'var(--sp-5)', color:'var(--ink)' }}>👥 Registered Users ({users.length})</h3>
      {users.length === 0 && <p style={{ color:'var(--ink-light)' }}>No users registered yet.</p>}
      {users.map(u => (
        <div key={u.username} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--bg-raised)', border:'2px solid var(--border)', borderRadius:'var(--r-lg)', marginBottom:8, flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontWeight:800, color:'var(--ink)' }}>👤 {u.username}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--ink-light)', marginTop:2 }}>
              Progress: {u.completedQuestions?.length??0}/69 · Painted: {Object.keys(u.paintedRegions||{}).length} wilayas · Joined: {u.createdAt?new Date(u.createdAt).toLocaleDateString():'—'}
            </div>
          </div>
          <div className="badge badge-green" style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem' }}>
            {u.completedQuestions?.length??0} / 69 ⭐
          </div>
        </div>
      ))}
    </div>
  );
}
