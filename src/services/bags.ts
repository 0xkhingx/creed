import type { Creator, ClaimEvent } from "../types";

const SERVER_URL = "http://localhost:3001";

export async function getCreatorFees(mint: string): Promise<Creator> {
  const res = await fetch(`${SERVER_URL}/api/fees/${mint}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error);

  return {
    mint: data.mint,
    name: "",
    symbol: "",
    lifetimeFees: data.lifetimeFees,
    claimableFees: data.totalClaimed || 0,
  };
}

export async function getClaimEvents(mint: string): Promise<ClaimEvent[]> {
  const res = await fetch(`${SERVER_URL}/api/events/${mint}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error);
  return data;
}