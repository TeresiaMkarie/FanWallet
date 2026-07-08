import { useState, useCallback } from "react";
import { uid } from "../lib/format";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return [toasts, push];
}
