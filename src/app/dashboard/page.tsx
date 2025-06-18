"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlotMachine } from "@/components/slot-machine"
import { TransactionHistory } from "@/components/transaction-history"
import { Leaderboard } from "@/components/leaderboard"
import { Coins, LogOut, Trophy, History, Gamepad2 } from "lucide-react"
import { destroyCookie, parseCookies } from 'nookies'

interface User {
  email: string
  balance: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [coinsAdded, setCoinsAdded] = useState<number | null>(null)
  const [animateCoins, setAnimateCoins] = useState(false)

  const router = useRouter()
  const cookies = parseCookies()
  const token = cookies.token

  const handleLogout = () => {
    destroyCookie(null, "token", { path: "/" })
    router.push("/auth/login")
  }

  const updateBalance = (newBalance: number) => {
    setUser((prev) => {
      if (!prev) return null
      const diff = newBalance - prev.balance
      if (diff > 0) {
        setCoinsAdded(diff)
        setAnimateCoins(true)
        setTimeout(() => {
          setAnimateCoins(false)
          setCoinsAdded(null)
        }, 1500)
      }
      return { ...prev, balance: newBalance }
    })
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          router.push("/auth/login")
          return
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          router.push("/auth/login")
        }
      } catch {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-500/20 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coins className="h-8 w-8 text-amber-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Lucky Slots Casino
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Card className="relative bg-slate-700/50 border-amber-500/20 overflow-visible">
              <CardContent className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Coins
                    className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${animateCoins ? "scale-125" : "scale-100"
                      }`}
                  />
                  <span className="text-amber-400 font-bold text-lg">
                    {user.balance.toLocaleString()}
                  </span>
                </div>

                {animateCoins && coinsAdded !== null && (
                  <div className="absolute -top-3 right-2 text-amber-300 font-bold text-sm animate-bounce">
                    +{coinsAdded}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Tabs defaultValue="game" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-amber-500/20">
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 hover:cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Game
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 hover:cursor-pointer"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 hover:cursor-pointer"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <SlotMachine balance={user.balance} onBalanceUpdate={updateBalance} token={token} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory token={token} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
