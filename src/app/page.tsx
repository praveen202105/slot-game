import { redirect } from "next/navigation"
import { parseCookies } from "nookies"

export default async function HomePage() {
  const cookies = parseCookies()
  const token = cookies.token

  if (token) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
