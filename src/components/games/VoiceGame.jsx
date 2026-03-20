// src/components/games/VoiceGame.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LangContext';

const ROUNDS = [
  { id:1, quote:'"I did not surrender. I chose peace over continued bloodshed of my people."', quoteAr:'"لم أستسلم. اخترت السلام على الاستمرار في إراقة دماء شعبي."', speaker:'Emir Abdelkader', year:'1847', context:'After 15 years of resistance against France', options:['Emir Abdelkader','Ahmed Ben Bella',"Larbi Ben M'hidi",'Messali Hadj'], correct:0, icon:'🏇', color:'#DC2626' },
  { id:2, quote:'"La révolution est en marche et rien ne peut l\'arrêter."', quoteAr:'"الثورة في طريقها ولا شيء يمكن أن يوقفها."', speaker:"Larbi Ben M'hidi", year:'1957', context:'During the Battle of Algiers', options:['Abane Ramdane',"Larbi Ben M'hidi",'Zighoud Youcef','Mourad Didouche'], correct:1, icon:'🌟', color:'#1D4ED8' },
  { id:3, quote:'"Algeria is not French. Algeria is Algerian."', quoteAr:'"الجزائر ليست فرنسية. الجزائر جزائرية."', speaker:'Ferhat Abbas', year:'1943', context:'From the Manifesto of the Algerian People', options:['Messali Hadj','Ben Youcef Ben Khedda','Ferhat Abbas','Mohamed Boudiaf'], correct:2, icon:'📋', color:'#059669' },
  { id:4, quote:'"El Djazaïr horra democratia!" — Algeria, free and democratic!', quoteAr:'"الجزائر حرة ديمقراطية!"', speaker:'The Hirak Protesters', year:'2019', context:'Chant heard every Friday during the Hirak movement', options:['FIS Supporters','The Hirak Protesters','FLN Congress','Army Officers'], correct:1, icon:'🌊', color:'#7C3AED' },
  { id:5, quote:"\"We will nationalize our oil and gas — Algeria's wealth belongs to Algerians.\"", quoteAr:'"سنؤمم نفطنا وغازنا — ثروة الجزائر للجزائريين."', speaker:'Houari Boumediene', year:'1971', context:'Announcing the nationalization of hydrocarbons', options:['Ahmed Ben Bella','Chadli Bendjedid','Houari Boumediene','Liamine Zéroual'], correct:2, icon:'🛢️', color:'#D97706' },
];

export default function VoiceGame() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const [roundIdx,  setRoundIdx]  = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [answered,  setAnswered]  = useState(false);
  const [score,     setScore]     = useState(0);
  const [finished,  setFinished]  = useState(false);
  const [revealed,  setRevealed]  = useState(false);

  const round = ROUNDS[roundIdx];
  const total = ROUNDS.length;

  const handleAnswer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === round.correct) setScore(s => s + 20);
  };

  const next = () => {
    if (roundIdx + 1 >= total) { setFinished(true); return; }
    setRoundIdx(i => i + 1);
    setSelected(null); setAnswered(false); setRevealed(false);
  };

  const restart = () => {
    setRoundIdx(0); setSelected(null); setAnswered(false);
    setScore(0); setFinished(false); setRevealed(false);
  };

  if (finished) {
    const pct = Math.round((score / (total * 20)) * 100);
    const grade = pct >= 80 ? { emoji:'🏆', label:t('voice.grade.expert') }
                : pct >= 60 ? { emoji:'🌟', label:t('voice.grade.good')   }
                :              { emoji:'📚', label:t('voice.grade.keep')   };
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg-page)', display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--sp-8)' }}>
        <div className="card anim-bounce-in" style={{ maxWidth:'500px', width:'100%', padding:'var(--sp-10)', textAlign:'center' }}>
          <div style={{ fontSize:'5rem', marginBottom:'var(--sp-4)', animation:'tada 1s ease' }}>{grade.emoji}</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--ink)', marginBottom:'var(--sp-2)' }}>{grade.label}</h2>
          <p style={{ color:'var(--ink-mid)', marginBottom:'var(--sp-6)' }}>
            {t('voice.finish.sub').replace('{{score}}', score).replace('{{max}}', total*20).replace('{{pct}}', pct)}
          </p>
          <div style={{ display:'flex', gap:'var(--sp-3)', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-sky btn-lg" onClick={restart}>{t('voice.again')}</button>
            <button className="btn btn-ghost" onClick={() => navigate('/games')}>{t('games.all')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-page)', padding:'var(--sp-8)' }}>
      <div style={{ maxWidth:'680px', margin:'0 auto' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--sp-5)', gap:'var(--sp-3)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/games')}>{t('voice.back')}</button>
          <div style={{ background:'var(--sky-bg)', border:'2.5px solid var(--sky-light)', borderRadius:'var(--r-pill)', padding:'4px 16px', fontFamily:'var(--font-display)', fontWeight:800, color:'var(--sky-dark)', fontSize:'0.9rem' }}>
            🎙️ {score} {t('voice.pts')}
          </div>
        </div>

        <div style={{ marginBottom:'var(--sp-6)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', fontWeight:700, color:'var(--ink-light)', marginBottom:'6px' }}>
            <span>{t('voice.round')} {roundIdx+1} {t('voice.of')} {total}</span>
            <span style={{ color:'var(--sky-dark)' }}>{t('voice.label')}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width:`${(roundIdx/total)*100}%`, background:'linear-gradient(90deg,var(--sky-dark),var(--sky-light))' }}/>
          </div>
        </div>

        <div className="card" style={{ padding:'var(--sp-8)', marginBottom:'var(--sp-5)', background:round.color+'0D', border:`3px solid ${round.color}33`, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'var(--sp-3)', marginBottom:'var(--sp-5)' }}>
            <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:round.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', boxShadow:`0 4px 0 ${round.color}88`, flexShrink:0, animation:answered?'none':'pulse 2s ease-in-out infinite' }}>🎙️</div>
            <div className="audio-wave">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bar" style={{ background:`linear-gradient(180deg,${round.color},${round.color}88)` }}/>)}
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--ink-light)', fontWeight:700 }}>{round.year}</div>
          </div>

          <blockquote style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1rem,2.5vw,1.3rem)', color:'var(--ink)', lineHeight:1.6, fontStyle:'italic', marginBottom:'var(--sp-4)', padding:'0 var(--sp-4)' }}>
            {round.quote}
          </blockquote>

          <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(r => !r)} style={{ fontSize:'0.78rem' }}>
            {revealed ? t('voice.arabic.hide') : t('voice.arabic.show')}
          </button>

          {revealed && (
            <div className="anim-slide-up" style={{ marginTop:'var(--sp-4)', fontFamily:'var(--font-arabic)', fontSize:'1.05rem', color:'var(--ink-mid)', direction:'rtl', background:'var(--bg-raised)', borderRadius:'var(--r-lg)', padding:'var(--sp-3) var(--sp-5)', border:'2px dashed var(--border-mid)' }}>
              {round.quoteAr}
            </div>
          )}

          <div style={{ marginTop:'var(--sp-4)', fontSize:'0.8rem', color:'var(--ink-light)', fontStyle:'italic' }}>
            {t('voice.context')} {round.context}
          </div>
        </div>

        <h3 style={{ fontFamily:'var(--font-display)', textAlign:'center', color:'var(--ink)', marginBottom:'var(--sp-5)', fontSize:'1.15rem' }}>
          {t('voice.who')}
        </h3>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-3)', marginBottom:'var(--sp-5)' }}>
          {round.options.map((opt, i) => {
            const isCorrect = i === round.correct;
            const isPicked  = i === selected;
            let bg='var(--bg-surface)', border='var(--border-mid)', color='var(--ink)', shadow='var(--shadow-card)';
            if (answered) {
              if (isCorrect)   { bg='var(--green-bg)'; border='var(--green-light)'; color='var(--green-mid)'; shadow='0 4px 0 var(--green-light)'; }
              else if (isPicked){ bg='var(--coral-bg)'; border='var(--coral-light)'; color='var(--coral-dark)'; shadow='0 4px 0 var(--coral-light)'; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} style={{ background:bg, border:`3px solid ${border}`, borderRadius:'var(--r-lg)', padding:'var(--sp-4)', cursor:answered?'default':'pointer', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.9rem', color, boxShadow:shadow, transition:'all 0.2s var(--spring)', display:'flex', alignItems:'center', gap:'10px', animation:answered&&isPicked?(isCorrect?'jelly 0.5s ease':'shake 0.4s ease'):'none' }}
                onMouseEnter={e=>{ if(!answered){e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 6px 0 var(--border-mid)';} }}
                onMouseLeave={e=>{ if(!answered){e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='var(--shadow-card)';} }}
              >
                <span style={{ width:'26px', height:'26px', borderRadius:'50%', background:answered&&isCorrect?'var(--green-mid)':answered&&isPicked?'var(--coral-dark)':'var(--bg-sunken)', border:`2px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, color:(answered&&(isCorrect||isPicked))?'white':'var(--ink-light)', flexShrink:0 }}>
                  {answered&&isCorrect?'✓':answered&&isPicked?'✗':String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="card anim-slide-up" style={{ padding:'var(--sp-5) var(--sp-6)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--sp-4)', flexWrap:'wrap', background:selected===round.correct?'var(--green-bg)':'var(--coral-bg)', border:`3px solid ${selected===round.correct?'var(--green-light)':'var(--coral-light)'}` }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:selected===round.correct?'var(--green-mid)':'var(--coral-dark)', fontSize:'1.05rem', marginBottom:'4px' }}>
                {selected === round.correct ? t('voice.correct') : t('voice.wrong')}
              </div>
              <div style={{ fontSize:'0.82rem', color:'var(--ink-mid)' }}>
                {round.icon} <strong style={{ color:'var(--ink)' }}>{round.speaker}</strong> {t('voice.said')} {round.year}
              </div>
            </div>
            <button className={`btn ${selected===round.correct?'btn-green':'btn-sky'} btn-sm`} onClick={next}>
              {roundIdx+1 >= total ? t('voice.results') : t('voice.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
