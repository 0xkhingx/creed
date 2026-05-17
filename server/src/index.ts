import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Connection, PublicKey } from "@solana/web3.js";
import { BagsSDK } from "@bagsfm/bags-sdk";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const connection = new Connection(process.env.VITE_SOLANA_RPC_URL!);
const sdk = new BagsSDK(
  process.env.VITE_BAGS_API_KEY!,
  connection,
  "processed"
);

// Get creator fees
app.get("/api/fees/:mint", async (req, res) => {
  try {
    const pubkey = new PublicKey(req.params.mint);
    const lifetimeFees = await sdk.state.getTokenLifetimeFees(pubkey);
    const events = await sdk.state.getTokenClaimEvents(pubkey);
    const totalClaimed = events.reduce(
      (sum: number, e: any) => sum + e.amount,
      0
    );

    res.json({
      mint: req.params.mint,
      lifetimeFees: lifetimeFees / 1e9,
      totalClaimed: totalClaimed / 1e9,
    });
  } catch (err: any) {
    console.error("Full error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get claim events
app.get("/api/events/:mint", async (req, res) => {
  try {
    const pubkey = new PublicKey(req.params.mint);
    const events = await sdk.state.getTokenClaimEvents(pubkey);

    res.json(
      events.map((e: any) => ({
        wallet: e.wallet,
        amount: e.amount / 1e9,
        timestamp: e.timestamp,
        isCreator: e.isCreator,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Creed server running on http://localhost:${PORT}`);
});
