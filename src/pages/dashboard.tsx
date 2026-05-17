import { useState } from "react";
import { useCreed } from "../hooks/useCreed";

export default function Dashboard() {
  const [mint, setMint] = useState("");
  const { creator, signal, loading, error, analyze } = useCreed();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-2">Creed</h1>
        <p className="text-gray-400 mb-8">
          Creator fee intelligence. Holder loyalty. Onchain truth.
        </p>

        {/* Input */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Paste token mint address..."
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow-500"
          />
          <button
            onClick={() => analyze(mint)}
            disabled={loading || !mint}
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Creator Stats */}
        {creator && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Lifetime Fees</p>
              <p className="text-2xl font-bold">{creator.lifetimeFees.toFixed(4)} SOL</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Claimable Now</p>
              <p className="text-2xl font-bold text-yellow-500">{creator.claimableFees.toFixed(4)} SOL</p>
            </div>
          </div>
        )}

        {/* Creed Signal */}
        {signal && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-semibold mb-4">Creed Signal</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                signal.action === "distribute" ? "bg-green-900 text-green-400" :
                signal.action === "boost" ? "bg-blue-900 text-blue-400" :
                "bg-gray-800 text-gray-400"
              }`}>
                {signal.action.toUpperCase()}
              </span>
              <p className="text-gray-300 text-sm">{signal.insight}</p>
            </div>

            <p className="text-gray-400 text-sm">
              Recommended distribution: <span className="text-yellow-500 font-semibold">{signal.recommendedDistribution}%</span> of claimable fees
            </p>
          </div>
        )}

        {/* Holder Loyalty Scores */}
        {signal && signal.loyaltyScores.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Pack Loyalty Scores</h2>
            <div className="space-y-3">
              {signal.loyaltyScores.map((holder) => (
                <div key={holder.wallet} className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-mono">
                    {holder.wallet.slice(0, 6)}...{holder.wallet.slice(-4)}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${holder.loyaltyScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {holder.loyaltyScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}