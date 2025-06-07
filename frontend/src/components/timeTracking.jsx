// hooks/useDailyTimeTracker.js
import { useEffect } from "react";

export default function useDailyTimeTracker() {
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const key = `track-${today}`;

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "0");
    }

    const interval = setInterval(() => {
      const current = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, (current + 1).toString());
    }, 60_000); // every 1 minute

    return () => clearInterval(interval);
  }, []);
}
