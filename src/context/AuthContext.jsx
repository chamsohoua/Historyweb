// src/context/AuthContext.jsx — Custom auth backed by Firestore
import { createContext, useContext, useState, useEffect } from 'react';
import {
  doc, getDoc, getDocs, collection, setDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext(null);
const SESSION_KEY = 'alhq_session';
const USERS_COL   = 'users';

// ── Admin accounts — add yours here ──────────────────────────
// To add more admins just append to this array
const ADMIN_ACCOUNTS = [
  { username: 'admin_dz', password: 'AlgeriaQuest2024!' },
  { username: 'admin',    password: 'adminadmin' },
];
const isAdminCreds = (u, p) =>
  ADMIN_ACCOUNTS.some(a => a.username === u && a.password === p);

// ── Session helpers ───────────────────────────────────────────
const getSession  = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const saveSession = u  => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
const clearSession= () => localStorage.removeItem(SESSION_KEY);

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin,     setIsAdmin]     = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) { setLoading(false); return; }
    if (session.role === 'admin') {
      setIsAdmin(true);
      setCurrentUser(session);
      setLoading(false);
    } else {
      getDoc(doc(db, USERS_COL, session.username))
        .then(snap => { if (snap.exists()) setCurrentUser(snap.data()); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  // ── signup ──────────────────────────────────────────────────
  const signup = async (username, password) => {
    if (!username?.trim() || !password?.trim())
      return { success: false, message: 'Please fill all fields.' };
    if (username.length < 3)
      return { success: false, message: 'Username must be at least 3 characters.' };
    if (password.length < 6)
      return { success: false, message: 'Password must be at least 6 characters.' };

    const snap = await getDoc(doc(db, USERS_COL, username));
    if (snap.exists()) return { success: false, message: 'Username already taken.' };

    const newUser = {
      username, password,
      completedQuestions: [],
      paintedRegions: {},
      currentProgress: 0,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, USERS_COL, username), newUser);
    saveSession(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };

  // ── login ───────────────────────────────────────────────────
  const login = async (username, password) => {
    if (!username?.trim() || !password?.trim())
      return { success: false, message: 'Please fill all fields.' };

    // Admin check first
    if (isAdminCreds(username, password)) {
      const adminSession = { username, role: 'admin' };
      saveSession(adminSession);
      setCurrentUser(adminSession);
      setIsAdmin(true);
      return { success: true, isAdmin: true };
    }

    // Regular user via Firestore
    try {
      const snap = await getDoc(doc(db, USERS_COL, username));
      if (!snap.exists()) return { success: false, message: 'Invalid username or password.' };
      const user = snap.data();
      if (user.password !== password) return { success: false, message: 'Invalid username or password.' };
      saveSession(user);
      setCurrentUser(user);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Connection error. Check your internet.' };
    }
  };

  // ── logout ──────────────────────────────────────────────────
  const logout = () => {
    clearSession();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // ── updateProgress ──────────────────────────────────────────
  const updateProgress = async (updates) => {
    if (!currentUser || isAdmin) return;
    const updated = { ...currentUser, ...updates };
    try {
      await updateDoc(doc(db, USERS_COL, currentUser.username), updates);
    } catch (_) {}
    saveSession(updated);
    setCurrentUser(updated);
  };

  const markQuestionComplete = (questionId) => {
    if (!currentUser) return;
    const already = currentUser.completedQuestions || [];
    if (already.includes(questionId)) return;
    const completedQuestions = [...already, questionId];
    updateProgress({ completedQuestions, currentProgress: completedQuestions.length });
  };

  const paintRegion = (regionCode, colorIndex) => {
    if (!currentUser) return;
    const painted = { ...(currentUser.paintedRegions || {}) };
    painted[regionCode] = colorIndex;
    updateProgress({ paintedRegions: painted });
  };

  const value = {
    currentUser, isAdmin, isGuest: !currentUser, loading,
    signup, login, logout, updateProgress, markQuestionComplete, paintRegion,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
