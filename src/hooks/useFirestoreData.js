// src/hooks/useFirestoreData.js
// Fetches a Firestore collection and returns { data, loading, error, refetch }
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestoreCollection(colName, orderField = 'createdAt') {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, colName));
      const snap = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setError(null);
    } catch (e) {
      console.error(`useFirestoreCollection(${colName}):`, e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [colName]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
