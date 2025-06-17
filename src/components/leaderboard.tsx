"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LeaderboardEntry {
  rank: number
  userId: string
  email: string
  netWin: number
  totalSpins: number
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard")
        const data = await res.json()
        setLeaderboard(data)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <Card className="bg-slate-800/50 border-amber-500/20">
      <CardHeader>
        <CardTitle className="text-xl text-amber-400">🏆 Leaderboard</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No entries yet</div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className="flex justify-between items-center p-4 rounded-md bg-slate-700/30 border border-slate-600/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-amber-400 text-lg">#{entry.rank}</span>
                    <span>{entry.email}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Spins: {entry.totalSpins}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${entry.netWin >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {entry.netWin >= 0 ? `+${entry.netWin}` : entry.netWin}
                  </div>
                  <Badge
                    className={`mt-1 ${entry.netWin >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {entry.netWin >= 0 ? "Profit" : "Loss"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
