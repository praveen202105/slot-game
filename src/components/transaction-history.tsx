"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react"
import { parseCookies } from "nookies"

interface Transaction {
  _id: string
  userId: string
  wager: number
  winAmount: number
  spinResult: string[]
  createdAt: string
}


export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const cookies = parseCookies(); // works client-side in Next.js
      const token = cookies.token; // assumes you stored it as 'token'
      const response = await fetch("/api/transactions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-amber-500/20">
        <CardContent className="p-8 text-center">
          <div className="text-amber-400">Loading transactions...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-amber-500/20">
      <CardHeader>
        <CardTitle className="text-xl text-amber-400">Transaction History</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No transactions yet. Start spinning to see your history!
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {transaction.winAmount > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-400" />
                      )}

                      <div>
                        <div className="font-medium text-white">Spin</div>
                        <div className="text-sm text-slate-400">{formatDate(transaction.createdAt)}</div>
                      </div>
                    </div>

                    {transaction.spinResult && (
                      <div className="flex space-x-1">
                        {transaction.spinResult.map((symbol, index) => (
                          <span key={index} className="text-2xl">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold ${transaction.winAmount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {transaction.winAmount > 0
                        ? `+${transaction.winAmount}`
                        : `-${transaction.wager}`}
                    </div>
                    {transaction.winAmount > 0 && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/20">WIN</Badge>
                    )}
                  </div>
                </div>
              ))}

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-slate-400">
                  Page {page} of {totalPages}
                </span>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
