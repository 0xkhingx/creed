export interface Creator {
  mint: string;
  name: string;
  symbol: string;
  lifetimeFees: number;
  claimableFees: number;
}

export interface Holder {
  wallet: string;
  claimCount: number;
  totalClaimed: number;
  lastClaim: number;
  loyaltyScore: number;
}

export interface Pack {
  id: string;
  creatorMint: string;
  members: Holder[];
  totalEarned: number;
}

export interface ClaimEvent {
  wallet: string;
  amount: number;
  timestamp: number;
  isCreator: boolean;
}

export interface CreedSignal {
  loyaltyScores: Holder[];
  recommendedDistribution: number;
  insight: string;
  action: "distribute" | "hold" | "boost";
}