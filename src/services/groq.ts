import type { CreedSignal, ClaimEvent } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Creed's intelligence layer. 
You analyze holder claim activity for creator tokens on Bags.fm.
Your job is to score holder loyalty and recommend fair fee distribution.
Always respond with valid JSON only. No explanation, no markdown.`;

export async function analyzeHolders(
  events: ClaimEvent[],
  lifetimeFees: number,
  claimableFees: number
): Promise<CreedSignal> {
  const prompt = `
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

loyaltyScore is 0-100. recommendedDistribution is the % of claimable fees to distribute to holders.
insight is one sentence explaining your recommendation.
action is what the creator should do right now.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const text = data.choices[0].message.content;
  return JSON.parse(text);
}