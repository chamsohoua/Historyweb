// src/hooks/useContent.js
// Generic hook: reads a Firestore "content/{docId}" document.
// Falls back to provided defaultData if the doc doesn't exist yet.
// Admin writes via setDoc → all users see changes on next load.
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function useContent(docId, defaultData) {
  const [data,    setData]    = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'content', docId))
      .then(snap => {
        if (snap.exists()) setData({ ...defaultData, ...snap.data() });
      })
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [docId]);

  const save = async (newData) => {
    await setDoc(doc(db, 'content', docId), newData, { merge: true });
    setData(d => ({ ...d, ...newData }));
  };

  return { data, loading, error, save };
}
