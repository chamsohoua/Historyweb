// src/components/games/QuizGame.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LangContext';

const QUESTIONS = [
  { q:'What year did France invade Algeria?', options:['1820','1830','1845','1860'], correct:1, emoji:'⚔️', difficulty:'easy' },
  { q:'On which date did the Algerian Revolution begin?', options:['July 5, 1954','November 1, 1954','March 19, 1962','January 1, 1955'], correct:1, emoji:'🔥', difficulty:'easy' },
  { q:'Algeria gained independence on:', options:['July 5, 1962','March 19, 1962','November 1, 1962','January 1, 1963'], correct:0, emoji:'🌟', difficulty:'easy' },
  { q:'Who was the first President of Algeria?', options:['Houari Boumediene','Ferhat Abbas','Ahmed Ben Bella','Chadli Bendjedid'], correct:2, emoji:'🎗️', difficulty:'medium' },
  { q:'Algeria is the largest country in:', options:['The Middle East','The World','Africa','Asia'], correct:2, emoji:'🌍', difficulty:'easy' },
  { q:'The Algerian Revolution lasted approximately:', options:['3 years','5 years','7.5 years','10 years'], correct:2, emoji:'⏳', difficulty:'medium' },
  { q:'What was the name of the Algerian political front that led the revolution?', options:['FIS','FLN','ALN','PPA'], correct:1, emoji:'📜', difficulty:'medium' },
  { q:'The Soummam Congress took place in:', options:['1954','1955','1956','1957'], correct:2, emoji:'📅', difficulty:'hard' },
  { q:'How many wilayas does Algeria have?', options:['36','42','48','58'], correct:2, emoji:'🗺️', difficulty:'easy' },
  { q:'Emir Abdelkader led resistance against France for approximately:', options:['5 years','10 years','15 years','20 years'], correct:2, emoji:'🏇', difficulty:'medium' },
  { q:'The "Black Decade" in Algeria refers to the:', options:['1970s','1980s','1990s','2000s'], correct:2, emoji:'⚫', difficulty:'medium' },
  { q:'Which Algerian city is known as "the City of Bridges"?', options:['Oran','Annaba','Constantine','Tlemcen'], correct:2, emoji:'🌉', difficulty:'hard' },
  { q:"Tassili n'Ajjer is famous for its:", options:['Roman ruins','Cave paintings','Ottoman mosques','French architecture'], correct:1, emoji:'🗿', difficulty:'medium' },
  { q:'The Algerian national football team is nicknamed:', options:['The Eagles','The Lions of the Atlas','The Desert Warriors','The Fennec Foxes'], correct:3, emoji:'⚽', difficulty:'easy' },
  { q:'Oil and gas were nationalized in Algeria in:', options:['1962','1965','1971','1980'], correct:2, emoji:'🛢️', difficulty:'hard' },
];

export default function QuizGame() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const q     = QUESTIONS[idx];
  const total = QUESTIONS.length;

  useEffect(() => {
    if (answered || finished) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const id = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, answered, finished]);

  const handleAnswer = useCallback((optIdx) => {
    if (answered) return;
    setSelected(optIdx);
    setAnswered(true);
    const correct = optIdx === q.correct;
    if (correct) {
      const bonus = timeLeft > 10 ? 20 : 10;
      setScore(s => s + bonus);
      const ns = streak + 1;
      setStreak(ns);
      setBestStreak(b => Math.max(b, ns));
    } else {
      setStreak(0);
    }
  }, [answered, q, timeLeft, streak]);

  const next = () => {
    if (idx + 1 >= total) { setFinished(true); return; }
    setIdx(i => i + 1);
    setSelected(null); setAnswered(false); setTimeLeft(20);
  };

  const restart = () => {
    setIdx(0); setSelected(null); setAnswered(false);
    setScore(0); setStreak(0); setBestStreak(0); setFinished(false); setTimeLeft(20);
  };

  const timerColor = timeLeft > 10 ? 'var(--green-mid)' : timeLeft > 5 ? 'var(--yellow-dark)' : 'var(--coral-dark)';
  const pts = timeLeft > 10 ? 20 : 10;

  if (finished) {
    const grade = score >= 250
      ? { emoji:'🏆', label:t('quiz.grade.perfect'),   color:'var(--yellow-dark)' }
      : score >= 180
      ? { emoji:'🌟', label:t('quiz.grade.excellent'), color:'var(--green-mid)'   }
      : score >= 120
      ? { emoji:'👍', label:t('quiz.grade.good'),      color:'var(--sky-dark)'    }
      :   { emoji:'📚', label:t('quiz.grade.keep'),      color:'var(--coral-dark)'  };

    return (
      <div style={{ minHeight:'100vh', background:'var(--bg-page)', display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--sp-8)' }}>
        <div className="card anim-bounce-in" style={{ maxWidth:'520px', width:'100%', padding:'var(--sp-10)', textAlign:'center' }}>
          <div style={{ fontSize:'5rem', marginBottom:'var(--sp-4)', animation:'tada 1s ease' }}>{grade.emoji}</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:grade.color, marginBottom:'var(--sp-2)' }}>{grade.label}</h2>
          <p style={{ color:'var(--ink-mid)', marginBottom:'var(--sp-6)' }}>
            {t('quiz.finish.sub').replace('{{score}}', score).replace('{{max}}', 300)}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'var(--sp-3)', marginBottom:'var(--sp-8)' }}>
            {[
              { label:t('quiz.stat.score'),   val:score,                                         emoji:'🏆', color:'var(--yellow-dark)', bg:'var(--yellow-bg)' },
              { label:t('quiz.stat.correct'), val:`${Math.round(score/15)}/${total}`,             emoji:'✅', color:'var(--green-mid)',   bg:'var(--green-bg)'  },
              { label:t('quiz.stat.streak'),  val:bestStreak,                                    emoji:'🔥', color:'var(--coral-dark)',  bg:'var(--coral-bg)'  },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, border:'2.5px solid var(--border-mid)', borderRadius:'var(--r-lg)', padding:'var(--sp-4)' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'4px' }}>{s.emoji}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--ink-light)', fontWeight:700, textTransform:'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'var(--sp-3)', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-green btn-lg" onClick={restart}>{t('quiz.again')}</button>
            <button className="btn btn-ghost" onClick={() => navigate('/games')}>{t('games.all')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-page)', padding:'var(--sp-8)' }}>
      <div style={{ maxWidth:'720px', margin:'0 auto' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--sp-5)', gap:'var(--sp-4)', flexWrap:'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/games')}>{t('quiz.back')}</button>
          <div style={{ display:'flex', gap:'var(--sp-3)', alignItems:'center' }}>
            {streak >= 2 && (
              <div style={{ background:'var(--coral-bg)', border:'2px solid var(--coral-light)', borderRadius:'var(--r-pill)', padding:'4px 14px', fontSize:'0.8rem', fontWeight:800, color:'var(--coral-dark)' }}>
                🔥 {streak} {t('quiz.streak')}
              </div>
            )}
            <div style={{ background:'var(--yellow-bg)', border:'2.5px solid var(--yellow)', borderRadius:'var(--r-pill)', padding:'4px 16px', fontFamily:'var(--font-display)', fontWeight:800, color:'var(--yellow-dark)', fontSize:'0.95rem' }}>
              ⭐ {score} {t('quiz.pts')}
            </div>
          </div>
        </div>

        <div style={{ marginBottom:'var(--sp-4)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', fontWeight:700, color:'var(--ink-light)', marginBottom:'6px' }}>
            <span>{t('quiz.question')} {idx+1} {t('quiz.of')} {total}</span>
            <span style={{ color: timerColor === 'var(--green-mid)' ? 'var(--green-mid)' : timerColor }}>● {t(`quiz.difficulty.${q.difficulty}`)}</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width:`${(idx/total)*100}%` }}/></div>
        </div>

        <div className="card" style={{ padding:'var(--sp-8)', marginBottom:'var(--sp-5)', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'var(--sp-4)' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'var(--bg-raised)', border:`4px solid ${timerColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem', color:timerColor, transition:'border-color 0.3s,color 0.3s' }}>
              {timeLeft}
            </div>
          </div>
          <div style={{ fontSize:'3rem', marginBottom:'var(--sp-4)', animation:'float 3s ease-in-out infinite' }}>{q.emoji}</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.1rem,3vw,1.5rem)', color:'var(--ink)', lineHeight:1.4 }}>{q.q}</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-3)', marginBottom:'var(--sp-5)' }}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isPicked  = i === selected;
            let bg='var(--bg-surface)', border='var(--border-mid)', color='var(--ink)', shadow='var(--shadow-card)', icon='';
            if (answered) {
              if (isCorrect)   { bg='var(--green-bg)'; border='var(--green-light)'; color='var(--green-mid)'; shadow='0 4px 0 var(--green-light)'; icon='✅'; }
              else if (isPicked){ bg='var(--coral-bg)'; border='var(--coral-light)'; color='var(--coral-dark)'; shadow='0 4px 0 var(--coral-light)'; icon='❌'; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} style={{ background:bg, border:`3px solid ${border}`, borderRadius:'var(--r-lg)', padding:'var(--sp-4) var(--sp-5)', cursor:answered?'default':'pointer', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.92rem', color, textAlign:'left', display:'flex', alignItems:'center', gap:'10px', boxShadow:shadow, transition:'all 0.2s var(--spring)', animation:answered&&isPicked&&!isCorrect?'shake 0.4s ease':answered&&isCorrect?'jelly 0.5s ease':'none' }}
                onMouseEnter={e=>{ if(!answered){e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 6px 0 var(--border-mid)';} }}
                onMouseLeave={e=>{ if(!answered){e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='var(--shadow-card)';} }}
              >
                <span style={{ width:'28px', height:'28px', borderRadius:'50%', background:answered&&isCorrect?'var(--green-mid)':answered&&isPicked?'var(--coral-dark)':'var(--bg-sunken)', border:`2px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:(answered&&(isCorrect||isPicked))?'white':'var(--ink-light)', flexShrink:0 }}>
                  {icon || String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="card anim-slide-up" style={{ padding:'var(--sp-5) var(--sp-6)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--sp-4)', flexWrap:'wrap', background:selected===q.correct?'var(--green-bg)':'var(--coral-bg)', border:`3px solid ${selected===q.correct?'var(--green-light)':'var(--coral-light)'}` }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, color:selected===q.correct?'var(--green-mid)':'var(--coral-dark)', fontSize:'1.05rem', marginBottom:'4px' }}>
                {selected === q.correct
                  ? t('quiz.correct').replace('{{pts}}', pts)
                  : t('quiz.wrong')}
              </div>
              {selected !== q.correct && (
                <div style={{ fontSize:'0.82rem', color:'var(--ink-mid)' }}>
                  {t('quiz.correct.answer')} <strong style={{ color:'var(--green-mid)' }}>{q.options[q.correct]}</strong>
                </div>
              )}
            </div>
            <button className={`btn ${selected===q.correct?'btn-green':'btn-coral'} btn-sm`} onClick={next}>
              {idx+1 >= total ? t('quiz.results') : t('quiz.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
