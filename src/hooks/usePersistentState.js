import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "fanwallet:v1:state";

function seedInitialState() {
  return {
    user: null,
    wallet: null,
    balance: 0,
    transactions: [],
    ownedTickets: [],
    splitGroups: [],
    twoFA: false,
    devices: [
      { id: "d1", name: "This device — Chrome, macOS", lastActive: Date.now(), current: true },
    ],
    onboarded: false,
  };
}

/* localStorage-backed persistence hook with debounce + graceful fallback */
export function usePersistentState() {
  const [state, setState] = useState(seedInitialState());
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch (e) {
      // no existing state yet, or storage unavailable — that's fine
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // storage unavailable — app still works in-memory
      }
    }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded]);

  return [state, setState, loaded];
}
