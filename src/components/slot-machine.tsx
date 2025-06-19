"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Loader2, Zap } from "lucide-react"
import useSound from "use-sound"

interface SlotMachineProps {
  balance: number
  onBalanceUpdate: (newBalance: number) => void
  token: string
}

const SYMBOLS = ["🍒", "🍋", "⭐", "💎", "🔔", "🍀"]

export function SlotMachine({ balance, onBalanceUpdate, token }: SlotMachineProps) {
  const [reels, setReels] = useState(["🍒", "🍋", "⭐"])
  const [wager, setWager] = useState(10)
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [play, { stop }] = useSound('/sound/spin.mp3', { volume: 0.5 });
  const [playWin, { stop: stopWin }] = useSound('/sound/winning.mp3', { volume: 0.5 });


  const tryClaimBonus = async () => {
    try {
      const res = await fetch("/api/spin/bonus", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        onBalanceUpdate(data.balance);
        setMessage("🎁 Bonus 100 coins granted!");
      } else {
        console.warn("Not eligible for bonus:", data?.error || "Unknown reason");
      }
    } catch (err) {
      console.error("Bonus spin error:", err);
    }
  };

  useEffect(() => {
    if (balance == 0) tryClaimBonus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance])

  const handleSpin = async () => {
    if (wager > balance) {
      setError("Insufficient balance!")
      return
    }

    if (wager <= 0) {
      setError("Wager must be greater than 0!")
      return
    }
    play();

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

      const response = await fetch("/api/spin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }, body: JSON.stringify({ wager }),
      })

      const data = await response.json()

      setTimeout(async () => {
        clearInterval(spinInterval)

        if (response.ok) {
          stop();
          setReels(data.result);
          onBalanceUpdate(data.updatedBalance)

          if (data.win > 0) {
            playWin();
            setMessage(`🎉 You won ${data.win} coins! `)
            setTimeout(() => {
              stopWin();
            }, 2000);
          } else {
            setMessage("Better luck next time!")
          }

          if (data.bonusSpinCount) await tryClaimBonus()

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
          <div className="space-y-6">
            {/* Wager Input + Quick Bets */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="text-slate-200 font-medium sm:w-20">Wager:</label>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1">
                <Input
                  type="number"
                  value={wager}
                  onChange={(e) =>
                    setWager(Math.max(1, Number.parseInt(e.target.value) || 1))
                  }
                  className="bg-slate-700/50 border border-slate-600 text-white w-full sm:w-32 px-4"
                  min="1"
                  max={balance}
                />

                <div className="flex flex-wrap gap-2">
                  {[10, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => quickBet(amount)}
                      variant="outline"
                      size="sm"
                      className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10 px-4 cursor-pointer"
                    >
                      {amount}
                    </Button>
                  ))}
                  <Button
                    onClick={() => quickBet(balance)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10 px-4 cursor-pointer"
                  >
                    MAX
                  </Button>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <Button
              onClick={handleSpin}
              disabled={spinning || wager > balance}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg py-5 transition-all cursor-pointer"
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
          <Card className="bg-slate-900/30 border border-amber-500/20 shadow-md">
            <CardHeader className="pb-2 border-b border-amber-500/10">
              <CardTitle className="text-lg font-semibold text-amber-400 tracking-wide">
                🎰 Payout Table
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm sm:text-base text-slate-200">
                {/* Row Item */}
                {[
                  ["3 💎 Diamond", "20x"],
                  ["3 ⭐ Star", "10x"],
                  ["3 🔔 Bell", "8x"],
                  ["3 🍀 Clover", "6x"],
                  ["3 🍒 Cherry", "5x"],
                  ["3 🍋 Lemon", "3x"],
                  ["2 💎 Diamond", "2x"],
                ].map(([symbol, multiplier], idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center font-medium">
                      {symbol}
                    </div>
                    <div className="text-right text-amber-400 font-bold tracking-wide drop-shadow-sm">
                      {multiplier}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  )
}
