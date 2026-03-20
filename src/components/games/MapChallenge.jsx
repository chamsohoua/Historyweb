// src/components/games/MapChallenge.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';
import { useGame }     from '../../context/GameContext';
import { algeriaWilayas, mapQuestions, TOTAL_QUESTIONS } from '../../data/algeriaMapData';
import AlgeriaSVGMap   from './AlgeriaSVGMap';
import '../../styles/MapChallenge.css';

// ── Fake Lottie fallback (renders CSS celebration) ──────────────────────────
function CelebrationOverlay({ type, onClose }) {
  const isFinale = type === 'finale';

  useEffect(() => {
    if (!isFinale) {
      const t = setTimeout(onClose, 2800);
      return () => clearTimeout(t);
    }
  }, [isFinale, onClose]);

  if (isFinale) {
    return (
      <div className="grand-finale-overlay" onClick={onClose}>
        <div className="grand-finale-stars">
          {Array.from({ length: 30 }, (_, i) => (
            <span
              key={i}
              className="finale-star"
              style={{
                left:             `${Math.random() * 100}%`,
                top:              `${Math.random() * 100}%`,
                animationDelay:   `${Math.random() * 3}s`,
                fontSize:         `${1 + Math.random() * 2}rem`,
              }}
            >
              {['⭐','✨','🌟','💫'][Math.floor(Math.random() * 4)]}
            </span>
          ))}
        </div>
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '8rem', animation: 'celebrateBounce 0.8s ease infinite' }}>🏆</div>
          <h2 className="grand-finale-title">🎉 الجزائر كاملة! 🎉<br/>You Conquered All 69 Regions!</h2>
          <p className="grand-finale-subtitle">You are a true Algeria History Master!</p>
          <button className="btn btn-yellow btn-lg" onClick={onClose} style={{ marginTop: '24px' }}>
            🌟 Celebrate Again!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="celebration-overlay" onClick={onClose}>
      <div style={{ fontSize: '10rem', animation: 'celebrateBounce 0.6s ease infinite' }}>
        {type === 'stars' ? '⭐' : '🎊'}
      </div>
      <div style={{
        fontFamily:   'var(--font-display)',
        fontSize:     '2rem',
        color:        'var(--color-green)',
        textShadow:   '0 2px 8px rgba(0,0,0,0.2)',
        animation:    'bounceIn 0.5s ease',
        background:   'white',
        padding:      '16px 32px',
        borderRadius: '50px',
        boxShadow:    'var(--shadow-xl)',
      }}>
        🎉 Correct!
      </div>
    </div>
  );
}

// ── Circular Progress Ring ──────────────────────────────────────────────────
function ProgressRing({ value, max, size = 100, stroke = 8 }) {
  const r           = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset      = circumference - (value / max) * circumference;

  return (
    <div className="painted-count-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-grey-200)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="painted-count-text">
        <span className="painted-count-number">{value}</span>
        <span className="painted-count-total">/ {max}</span>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function MapChallenge() {
  const { currentUser, isGuest, markQuestionComplete, paintRegion } = useAuth();
  const { triggerCorrect, triggerWrong, triggerFinale, showToast }  = useGame();
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────
  const [currentQIdx,    setCurrentQIdx]    = useState(0);
  const [paintedRegions, setPaintedRegions] = useState(currentUser?.paintedRegions || {});
  const [completedIds,   setCompletedIds]   = useState(
    new Set(currentUser?.completedQuestions || [])
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered,     setIsAnswered]      = useState(false);
  const [isShaking,      setIsShaking]       = useState(false);
  const [celebration,    setCelebration]     = useState(null); // null | 'confetti' | 'stars' | 'finale'
  const [feedbackEmoji,  setFeedbackEmoji]   = useState(null);
  const [streak,         setStreak]          = useState(0);
  const [highlightRegion, setHighlightRegion] = useState(null);

  // ── Derived ───────────────────────────────────────────────
  const paintedCount   = Object.keys(paintedRegions).length;
  const answeredCount  = completedIds.size;
  const progressPercent = (answeredCount / TOTAL_QUESTIONS) * 100;

  // Skip already-answered questions
  const availableQuestions = useMemo(
    () => mapQuestions.filter(q => !completedIds.has(q.id)),
    [completedIds]
  );

  const currentQuestion = availableQuestions[currentQIdx] || null;

  // When a click-type question is active, highlight the target on the map
  useEffect(() => {
    if (currentQuestion?.type === 'click') {
      setHighlightRegion(currentQuestion.target);
    } else {
      setHighlightRegion(null);
    }
  }, [currentQuestion]);

  // ── Guest Guard ───────────────────────────────────────────
  if (isGuest) {
    return (
      <div className="map-page">
        <div className="map-lock-screen">
          <div className="map-lock-icon">🔐</div>
          <h2 className="map-lock-title">Map Challenge Locked</h2>
          <p className="map-lock-subtitle">
            Sign in or create an account to unlock the Map Challenge!
            Paint all 48 wilayas of Algeria by answering 69 questions. 🗺️
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              🔑 Login
            </button>
            <button className="btn btn-green btn-lg" onClick={() => navigate('/signup')}>
              🚀 Sign Up Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Finished ──────────────────────────────────────────────
  if (answeredCount >= TOTAL_QUESTIONS && !celebration) {
    return (
      <div className="map-page">
        <div className="map-lock-screen">
          <div className="map-lock-icon" style={{ fontSize: '8rem' }}>🏆</div>
          <h2 className="map-lock-title" style={{ color: 'var(--color-green-dark)' }}>
            Congratulations! 🎉
          </h2>
          <p className="map-lock-subtitle">
            You've completed all 69 questions and painted the entire map of Algeria!
          </p>
          <button className="btn btn-yellow btn-lg" onClick={() => navigate('/games')}>
            🎮 Play Other Games
          </button>
        </div>
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────────────

  const handleCorrect = useCallback((questionId, regionCode = null) => {
    setIsAnswered(true);
    setFeedbackEmoji('⭐');
    setStreak(s => s + 1);

    // Paint a region
    const colorIndex = paintedCount % 12;
    const targetCode = regionCode || currentQuestion?.target;

    if (targetCode && !paintedRegions[targetCode]) {
      const updated = { ...paintedRegions, [targetCode]: colorIndex };
      setPaintedRegions(updated);
      paintRegion(targetCode, colorIndex);
      setHighlightRegion(null);
    }

    // Mark complete
    const newCompleted = new Set(completedIds);
    newCompleted.add(questionId);
    setCompletedIds(newCompleted);
    markQuestionComplete(questionId);

    // Trigger celebration
    const newPainted = Object.keys(paintedRegions).length + (targetCode ? 1 : 0);
    if (newCompleted.size >= TOTAL_QUESTIONS) {
      setTimeout(() => {
        triggerFinale();
        setCelebration('finale');
      }, 600);
    } else {
      triggerCorrect('confetti');
      setCelebration('confetti');
    }

    // Move to next after delay
    setTimeout(() => {
      setCurrentQIdx(i => Math.min(i, availableQuestions.length - 2));
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedbackEmoji(null);
      setCelebration(null);
    }, 2000);
  }, [
    currentQuestion, paintedRegions, completedIds, paintedCount,
    triggerCorrect, triggerFinale, paintRegion, markQuestionComplete, availableQuestions
  ]);

  const handleWrong = useCallback(() => {
    setStreak(0);
    setIsShaking(true);
    setFeedbackEmoji('❌');
    triggerWrong();
    setTimeout(() => {
      setIsShaking(false);
      setFeedbackEmoji(null);
    }, 800);
  }, [triggerWrong]);

  // MCQ answer selection
  const handleMCQAnswer = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    if (option === currentQuestion.correct) {
      handleCorrect(currentQuestion.id);
    } else {
      handleWrong();
    }
  };

  // Map click handler
  const handleRegionClick = (wilaya) => {
    if (!currentQuestion || currentQuestion.type !== 'click' || isAnswered) return;
    if (wilaya.code === currentQuestion.target) {
      handleCorrect(currentQuestion.id, wilaya.code);
    } else {
      handleWrong();
      showToast(`That's ${wilaya.name}. Keep trying!`, 'error');
    }
  };

  const handleSkip = () => {
    setCurrentQIdx(i => (i + 1) % Math.max(1, availableQuestions.length));
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="map-page">

      {/* ── Celebration ─────────────────────────────────── */}
      {celebration && (
        <CelebrationOverlay
          type={celebration}
          onClose={() => setCelebration(null)}
        />
      )}

      {/* ── Feedback Flash ──────────────────────────────── */}
      {feedbackEmoji && (
        <div className="feedback-flash" aria-live="polite">{feedbackEmoji}</div>
      )}

      {/* ── Header ──────────────────────────────────────── */}
      <div className="map-header">
        <div>
          <div className="map-header-title">🗺️ Map Challenge</div>
          <div className="map-header-sub">Paint Algeria one question at a time</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {streak >= 3 && (
            <div className="streak-pill">
              <span className="streak-flame">🔥</span>
              {streak} Streak!
            </div>
          )}
          <div className="map-score-pill">
            ✅ <span className="score-number">{answeredCount}</span>
            &nbsp;/ {TOTAL_QUESTIONS}
          </div>
          <button
            className="btn btn-outline"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => navigate('/games')}
          >
            ← Games
          </button>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────── */}
      <div className="map-main-layout">

        {/* ── Left: Parchment Map ─────────────────────── */}
        <div className="parchment-container">
          <div className="parchment-bg">
            <div className="parchment-title">🗺️ الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <hr className="parchment-divider" />

            {currentQuestion?.type === 'click' && (
              <div style={{
                textAlign:  'center',
                marginBottom: '12px',
                fontFamily: 'var(--font-accent)',
                fontWeight: 700,
                color: 'var(--parchment-ink)',
                fontSize: '0.9rem',
                opacity: 0.8,
              }}>
                👆 Click the correct region on the map!
              </div>
            )}

            <AlgeriaSVGMap
              paintedRegions={paintedRegions}
              highlightRegion={currentQuestion?.type === 'click' ? currentQuestion.target : null}
              onRegionClick={handleRegionClick}
            />

            {/* Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#B8A898' }} /> Unpainted
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--color-purple)' }} /> Answered
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ──────────────────────────── */}
        <div className="map-sidebar">

          {/* Progress Card */}
          <div className="map-progress-card">
            <h3>📊 Your Progress</h3>
            <ProgressRing value={answeredCount} max={TOTAL_QUESTIONS} />
            <div className="progress-bar-wrap" style={{ marginTop: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{ '--target-width': `${progressPercent}%` }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--color-grey-600)',
              marginTop: '8px',
              fontFamily: 'var(--font-body)',
            }}>
              <span>🗺️ {paintedCount} / 48 painted</span>
              <span>✅ {answeredCount} / {TOTAL_QUESTIONS}</span>
            </div>
          </div>

          {/* Current Question Card */}
          {currentQuestion ? (
            <div className={`question-card ${isShaking ? 'shake' : ''}`}>

              <div className="question-number">
                Question {answeredCount + 1} of {TOTAL_QUESTIONS}
              </div>

              <div className="question-text">{currentQuestion.question}</div>

              {/* Click-type hint */}
              {currentQuestion.type === 'click' && (
                <div className="question-hint">
                  🖱️ Find and click the region on the map
                </div>
              )}

              {/* MCQ Options */}
              {currentQuestion.type === 'mcq' && (
                <div className="answer-grid">
                  {currentQuestion.options.map((opt) => {
                    let cls = 'answer-option';
                    if (selectedAnswer) {
                      if (opt === currentQuestion.correct) cls += ' correct';
                      else if (opt === selectedAnswer && opt !== currentQuestion.correct) cls += ' wrong';
                      cls += ' disabled';
                    }
                    return (
                      <button
                        key={opt}
                        className={cls}
                        onClick={() => handleMCQAnswer(opt)}
                        disabled={!!selectedAnswer}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action buttons */}
              <div className="map-action-row">
                <button className="btn-skip" onClick={handleSkip}>
                  Skip →
                </button>
              </div>
            </div>
          ) : (
            <div className="question-card">
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-dark)', fontSize: '1.1rem', marginTop: '8px' }}>
                  All questions answered!
                </p>
              </div>
            </div>
          )}

          {/* Highlight Info */}
          {currentQuestion?.type === 'click' && (() => {
            const targetWilaya = algeriaWilayas.find(w => w.code === currentQuestion.target);
            if (!targetWilaya) return null;
            const colorIndex = Object.keys(paintedRegions).length % 12;
            const colors = ['#7C3AED','#22C55E','#F97316','#38BDF8','#EC4899','#FBBF24',
                            '#2DD4BF','#A855F7','#EF4444','#84CC16','#F59E0B','#06B6D4'];
            return (
              <div className="region-highlight">
                <div className="region-highlight-name">
                  <span
                    className="region-target-dot"
                    style={{ background: colors[colorIndex] }}
                  />
                  {targetWilaya.name}
                </div>
                <div className="region-highlight-sub">
                  {targetWilaya.nameAr} — Wilaya #{targetWilaya.id}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
