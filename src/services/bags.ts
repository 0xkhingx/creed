import { BagsSDK } from "@bagsfm/bags-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import type { Creator, ClaimEvent } from "../types";

const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);
const sdk = new BagsSDK(import.meta.env.VITE_BAGS_API_KEY, connection, "processed");

export async function getCreatorFees(mint: string): Promise<Creator> {
  const pubkey = new PublicKey(mint);
  
  const lifetimeFees = await sdk.state.getTokenLifetimeFees(pubkey);
  const positions = await sdk.state.getAllClaimablePositions(pubkey);
  
  const claimableFees = positions.reduce((sum: number, p: any) => sum + p.amount, 0);

  return {
    mint,
    name: "",
    symbol: "",
    lifetimeFees: lifetimeFees / 1e9,
    claimableFees: claimableFees / 1e9,
  };
}

export async function getClaimEvents(mint: string): Promise<ClaimEvent[]> {
  const pubkey = new PublicKey(mint);
  const events = await sdk.state.getTokenClaimEvents(pubkey);

  return events.map((e: any) => ({
    wallet: e.wallet,
    amount: e.amount / 1e9,
    timestamp: e.timestamp,
    isCreator: e.isCreator,
  }));
}