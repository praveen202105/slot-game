"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Coins, Sparkles } from "lucide-react"
import { parseCookies, setCookie } from 'nookies';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  name: string;
  email: string;
  picture: string;
}
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleLoading, setGoogleLoading] = useState(false);
  const cookies = parseCookies()
  const token = cookies.token

  const router = useRouter()
  console.log("token ", token);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);


  const handleGoogleLogin = async (response: CredentialResponse) => {
    setGoogleLoading(true);
    // setError(null);

    try {
      if (response.credential) {
        const credential = response.credential;

        const decoded: DecodedToken = jwtDecode<DecodedToken>(credential);

        const userProfile = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server Error Response:", errorText);
          throw new Error(`Server responded with status ${res.status}`);
        }


        const data = await res.json();
        const { token } = data;

        setCookie(null, 'token', token, {
          maxAge: 60 * 60 * 24 * 7, // 7 day
          path: '/',
        });
        router.push("/dashboard");
      } else {
        console.error("Google Login Failed: No credential found");
        setError("Google Sign-In Failed");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {

        setCookie(null, 'token', data.token, {
          maxAge: 60 * 60 * 24 * 7, // 7 day
          path: '/',
        });
        router.push("/dashboard")
      } else {
        setError(data.message || "Login failed")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>

      <Card className="w-full max-w-md bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Coins className="h-12 w-12 text-amber-400" />
              <Sparkles className="h-6 w-6 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Lucky Slots Casino
          </CardTitle>
          <CardDescription className="text-slate-300">Sign in to start spinning and winning!</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 cursor-pointer text-black font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-6 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50/50 dark:bg-gray-900/20 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {googleLoading ? (
            <Button disabled variant="outline" className="w-full">
              Signing in with Google...
            </Button>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google Sign-In Failed")}
              size="large"
              width="50"
              shape="circle"
              logo_alignment="left"
            />
          )}

        </CardFooter>
      </Card>
    </div>
  )
}
