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


app.post("/api/analyze", async (req, res) => {
  try {
    const { events, lifetimeFees, claimableFees } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are Creed's intelligence layer. You analyze holder claim activity for creator tokens on Bags.fm. Your job is to score holder loyalty and recommend fair fee distribution. Always respond with valid JSON only. No explanation, no markdown.`,
            },
            {
              role: "user",
              content: `
Analyze these holder claim events for a creator token:
Lifetime fees earned: ${lifetimeFees} SOL
Currently claimable: ${claimableFees} SOL
Claim events (last 30 days): ${JSON.stringify(events)}

Return a JSON object with this exact shape:
{
  "loyaltyScores": [
    { "wallet": string, "claimCount": number, "totalClaimed": number, "lastClaim": number, "loyaltyScore": number }
  ],
  "recommendedDistribution": number,
  "insight": string,
  "action": "distribute" | "hold" | "boost"
}

loyaltyScore is 0-100. recommendedDistribution is the % of claimable fees to distribute to holders. insight is one sentence explaining your recommendation. action is what the creator should do right now.`,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();
    const text = data.choices[0].message.content;
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: err.message });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Creed server running on http://localhost:${PORT}`);
});
