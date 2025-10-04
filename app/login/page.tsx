"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import LoadingScreen from "@/components/LoadingScreen"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [boot, setBoot] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session) { router.replace("/"); return }
      } finally {
        setBoot(false)
      }
    }
    run()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.replace("/")

    setBusy(false)
  }

  if (boot) return <LoadingScreen />

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md glass p-8 space-y-6 text-center">
        <Logo size={80} />
        <h1 className="text-3xl font-bold">Roots</h1>
        <div className="rasta-line"></div>
        <p className="text-sm text-white/70">
          Preserve and explore lineage by documenting ancestors, stories, and relationships.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                   className="w-full px-3 py-2 rounded-lg bg-black/40 text-white border border-white/15 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                   className="w-full px-3 py-2 rounded-lg bg-black/40 text-white border border-white/15 focus:outline-none"/>
          </div>
          <button type="submit" disabled={busy}
                  className="w-full py-2 rounded-lg font-semibold text-black bg-gradient-to-r from-rastaRed via-rastaGold to-rastaGreen hover:opacity-90 transition">
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </main>
  )
}
