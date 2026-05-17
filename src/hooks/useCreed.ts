import { useState } from "react";
import type { Creator, CreedSignal } from "../types";
import { getCreatorFees, getClaimEvents } from "../services/bags";
import { analyzeHolders } from "../services/groq";

export function useCreed() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [signal, setSignal] = useState<CreedSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(mint: string) {
    setLoading(true);
    setError(null);

    try {
      const creatorData = await getCreatorFees(mint);
      const events = await getClaimEvents(mint);

      const holderEvents = events.filter((e) => !e.isCreator);

      const signal = await analyzeHolders(
        holderEvents,
        creatorData.lifetimeFees,
        creatorData.claimableFees
      );

      setCreator(creatorData);
      setSignal(signal);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { creator, signal, loading, error, analyze };
}