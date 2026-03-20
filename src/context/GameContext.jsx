// src/context/GameContext.jsx
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('confetti'); // confetti | stars | finale
  const [showError, setShowError]             = useState(false);
  const [feedbackEmoji, setFeedbackEmoji]     = useState(null);
  const [toast, setToast]                     = useState(null);

  const successAudioRef = useRef(null);
  const errorAudioRef   = useRef(null);

  // ── Audio ─────────────────────────────────────────────────
  const playSuccess = useCallback(() => {
    try {
      const audio = new Audio('/assets/sounds/success.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  const playError = useCallback(() => {
    try {
      const audio = new Audio('/assets/sounds/error.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  // ── Haptic ────────────────────────────────────────────────
  const haptic = useCallback((type = 'light') => {
    if (!navigator.vibrate) return;
    const patterns = { light: [30], medium: [50, 30, 50], heavy: [100, 50, 100] };
    navigator.vibrate(patterns[type] || patterns.light);
  }, []);

  // ── Correct Answer ────────────────────────────────────────
  const triggerCorrect = useCallback((type = 'confetti') => {
    playSuccess();
    haptic('medium');
    setFeedbackEmoji('⭐');
    setCelebrationType(type);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setFeedbackEmoji(null);
    }, 2800);
  }, [playSuccess, haptic]);

  // ── Grand Finale ──────────────────────────────────────────
  const triggerFinale = useCallback(() => {
    playSuccess();
    haptic('heavy');
    setCelebrationType('finale');
    setShowCelebration(true);
  }, [playSuccess, haptic]);

  // ── Wrong Answer ──────────────────────────────────────────
  const triggerWrong = useCallback(() => {
    playError();
    haptic('heavy');
    setFeedbackEmoji('❌');
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setFeedbackEmoji(null);
    }, 800);
  }, [playError, haptic]);

  // ── Toast ─────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const value = {
    showCelebration,
    celebrationType,
    showError,
    feedbackEmoji,
    toast,
    triggerCorrect,
    triggerWrong,
    triggerFinale,
    showToast,
    playSuccess,
    playError,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
};
