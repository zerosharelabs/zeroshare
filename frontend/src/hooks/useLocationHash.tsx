import { useState, useEffect } from "react";

export function useLocationHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    // Only run on client
    const updateHash = () => {
      setHash(window.location.hash?.substring(1) || "");
    };
    updateHash(); // Set initial hash
    window.addEventListener("hashchange", updateHash);
    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  return hash;
}
