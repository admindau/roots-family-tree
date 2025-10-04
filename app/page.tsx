"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/components/LoadingScreen"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      else router.replace("/login")
      setLoading(false)
    }
    run()
  }, [router])

  if (loading || !user) return <LoadingScreen />

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-6">
      <div className="max-w-4xl w-full glass p-10">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-rastaGreen via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Roots Dashboard
        </h1>
        <p className="mb-8 text-white/80">
          Welcome back, <span className="font-semibold text-rastaGreen">{user.email}</span> 👋🏽
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/add-member")}
            className="px-6 py-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-rastaGreen to-emerald-700 shadow-neon hover:scale-105 transition text-black"
          >
            ➕ Add Member
          </button>
          <button
            onClick={() => router.push("/tree")}
            className="px-6 py-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
          >
            🌳 View Tree
          </button>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.replace("/login") }}
            className="px-6 py-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </main>
  )
}
