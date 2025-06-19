"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlotMachine } from "@/components/slot-machine"
import { TransactionHistory } from "@/components/transaction-history"
import { Leaderboard } from "@/components/leaderboard"
import { Coins, LogOut, Trophy, History, Gamepad2, Sparkles, Crown, Star, Menu } from "lucide-react"
import { destroyCookie, parseCookies } from "nookies"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface User {
  email: string
  balance: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [coinsAdded, setCoinsAdded] = useState<number | null>(null)
  const [animateCoins, setAnimateCoins] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const router = useRouter()
  const cookies = parseCookies()
  const token = cookies.token

  const handleLogout = () => {
    destroyCookie(null, "token", { path: "/" })
    router.push("/auth/login")
    setMobileMenuOpen(false)
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
        }, 2000)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4 px-4">
          <div className="relative">
            <Coins className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 animate-spin" />
            <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-amber-300 animate-pulse" />
          </div>
          <div className="text-amber-400 text-xl sm:text-2xl font-bold animate-pulse text-center">
            Loading Casino...
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements - Reduced for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Floating Decorative Elements - Fewer on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(window.innerWidth < 768 ? 3 : 6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400/20" />
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      <header className="relative z-10 border-b border-amber-500/30 bg-slate-800/80 backdrop-blur-xl shadow-2xl">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between sm:hidden">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full">
                  <Crown className="h-5 w-5 text-slate-900" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Lucky Slots
                </h1>
                <p className="text-amber-400/70 text-xs font-medium">Casino</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Balance */}
              <Card className="relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-amber-500/30 shadow-xl backdrop-blur-sm overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-lg"></div>
                <CardContent className="relative px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Coins
                        className={`h-4 w-4 text-amber-400 transition-all duration-500 ${animateCoins ? "scale-125 rotate-12" : "scale-100 rotate-0"
                          }`}
                      />
                      {animateCoins && (
                        <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping"></div>
                      )}
                    </div>
                    <span className="text-amber-400 font-bold text-sm">{user.balance.toLocaleString()}</span>
                  </div>

                  {/* Coin Animation */}
                  {animateCoins && coinsAdded !== null && (
                    <div className="absolute -top-3 right-1 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3 text-amber-300 animate-spin" />
                      <div className="text-amber-300 font-bold text-sm animate-bounce bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                        +{coinsAdded}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900/95 border-amber-500/30 backdrop-blur-xl">
                  <div className="flex flex-col space-y-6 mt-6">
                    <div className="text-center">
                      <p className="text-amber-400/70 text-sm">Welcome back,</p>
                      <p className="text-amber-400 font-semibold text-lg">{user.email}</p>
                    </div>

                    <div className="border-t border-amber-500/20 pt-6 ">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-full">
                  <Crown className="h-8 w-8 text-slate-900" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Lucky Slots Casino
                </h1>
                <p className="text-amber-400/70 text-sm font-medium">Premium Gaming Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Desktop Balance Card */}
              <Card className="relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-amber-500/30 shadow-2xl backdrop-blur-sm overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-lg"></div>
                <CardContent className="relative px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Coins
                        className={`h-6 w-6 text-amber-400 transition-all duration-500 ${animateCoins ? "scale-125 rotate-12" : "scale-100 rotate-0"
                          }`}
                      />
                      {animateCoins && (
                        <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-amber-400/70 text-xs font-medium uppercase tracking-wider">Balance</p>
                      <span className="text-amber-400 font-bold text-xl">{user.balance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Coin Animation */}
                  {animateCoins && coinsAdded !== null && (
                    <div className="absolute -top-4 right-4 flex items-center space-x-1">
                      <Sparkles className="h-4 w-4 text-amber-300 animate-spin" />
                      <div className="text-amber-300 font-bold text-lg animate-bounce bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                        +{coinsAdded}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* User Info */}
              <div className="text-right">
                <p className="text-amber-400/70 text-sm">Welcome back,</p>
                <p className="text-amber-400 font-semibold">{user.email}</p>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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
