// src/components/common/Toast.jsx
import { useGame } from '../../context/GameContext';

export default function Toast() {
  const { toast } = useGame();
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type || ''}`}>
      {toast.emoji && <span style={{ marginRight: '8px' }}>{toast.emoji}</span>}
      {toast.message}
    </div>
  );
}
