"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Logo from "./Logo"
import { useEffect, useState } from "react"

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      setAuthed(!!data?.session)
    }
    run()
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <div className="font-bold tracking-widest text-white/90">ROOTS</div>
        </div>
        <div className="rasta-line" />
        <div className="flex gap-6 text-sm font-medium">
          {authed ? (
            <>
              <Link href="/" className="hover:text-rastaGreen transition">Dashboard</Link>
              <Link href="/add-member" className="hover:text-rastaGold transition">Add Member</Link>
              <Link href="/tree" className="hover:text-rastaRed transition">Tree</Link>
              <button
                onClick={async () => { await supabase.auth.signOut(); router.replace("/login") }}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-rastaGreen transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
