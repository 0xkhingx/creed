import type { CreedSignal, ClaimEvent } from "../types";

const SERVER_URL = "http://localhost:3001";

export async function analyzeHolders(
  events: ClaimEvent[],
  lifetimeFees: number,
  claimableFees: number
): Promise<CreedSignal> {
  const res = await fetch(`${SERVER_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events, lifetimeFees, claimableFees }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}