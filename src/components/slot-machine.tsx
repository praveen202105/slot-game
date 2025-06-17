"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap } from "lucide-react"
import { parseCookies } from "nookies"

interface SlotMachineProps {
  balance: number
  onBalanceUpdate: (newBalance: number) => void
}

const SYMBOLS = ["🍒", "🍋", "⭐", "💎", "🔔", "🍀"]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SYMBOL_NAMES = {
  "🍒": "Cherry",
  "🍋": "Lemon",
  "⭐": "Star",
  "💎": "Diamond",
  "🔔": "Bell",
  "🍀": "Clover",
}

export function SlotMachine({ balance, onBalanceUpdate }: SlotMachineProps) {
  const [reels, setReels] = useState(["🍒", "🍋", "⭐"])
  const [wager, setWager] = useState(10)
  const [spinning, setSpinning] = useState(false)
  // const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSpin = async () => {
    if (wager > balance) {
      setError("Insufficient balance!")
      return
    }

    if (wager <= 0) {
      setError("Wager must be greater than 0!")
      return
    }

    setSpinning(true)
    setError("")
    setMessage("")

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ])
    }, 100)

    try {
      const cookies = parseCookies(); // works client-side in Next.js
      const token = cookies.token; // assumes you stored it as 'token'
      console.log("token ", token);

      const response = await fetch("/api/spin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }, body: JSON.stringify({ wager }),
      })

      const data = await response.json()

      setTimeout(() => {
        clearInterval(spinInterval)

        if (response.ok) {
          setReels(data.result);
          onBalanceUpdate(data.updatedBalance)

          if (data.win > 0) {
            setMessage(`🎉 You won ${data.win} coins! `)
          } else {
            setMessage("Better luck next time!")
          }
        } else {
          setError(data.message || "Spin failed")
        }

        setSpinning(false)
      }, 2000)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      clearInterval(spinInterval)
      setError("Network error occurred")
      setSpinning(false)
    }
  }

  const quickBet = (amount: number) => {
    setWager(Math.min(amount, balance))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            🎰 Slot Machine
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Slot Reels */}
          <div className="flex justify-center">
            <div className="bg-slate-900/50 rounded-lg p-6 border-2 border-amber-500/30">
              <div className="flex space-x-4">
                {reels.map((symbol, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center text-4xl border-2 border-amber-400/20 ${spinning ? "animate-pulse" : ""
                      }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <Alert className="border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-400 text-center font-medium">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400 text-center">{error}</AlertDescription>
            </Alert>
          )}

          {/* Betting Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-slate-200 font-medium min-w-0">Wager:</label>
              <Input
                type="number"
                value={wager}
                onChange={(e) => setWager(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="bg-slate-700/50 border-slate-600 text-white"
                min="1"
                max={balance}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => quickBet(10)}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                >
                  10
                </Button>
                <Button
                  onClick={() => quickBet(50)}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                >
                  50
                </Button>
                <Button
                  onClick={() => quickBet(100)}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                >
                  100
                </Button>
                <Button
                  onClick={() => quickBet(balance)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  MAX
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSpin}
              disabled={spinning || wager > balance}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg py-6"
            >
              {spinning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  SPIN ({wager} coins)
                </>
              )}
            </Button>
          </div>

          {/* Payout Table */}
          <Card className="bg-slate-900/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-amber-400">Payout Table</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>3 💎 Diamond</div>
                <div className="text-amber-400 font-bold">20x</div>
                <div>3 ⭐ Star</div>
                <div className="text-amber-400 font-bold">10x</div>
                <div>3 🔔 Bell</div>
                <div className="text-amber-400 font-bold">8x</div>
                <div>3 🍀 Clover</div>
                <div className="text-amber-400 font-bold">6x</div>
                <div>3 🍒 Cherry</div>
                <div className="text-amber-400 font-bold">5x</div>
                <div>3 🍋 Lemon</div>
                <div className="text-amber-400 font-bold">3x</div>
                <div>2 💎 Diamond</div>
                <div className="text-amber-400 font-bold">2x</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
