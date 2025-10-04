"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/components/LoadingScreen"

type Member = { id: string; name: string }

export default function AddMemberPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newId, setNewId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "", gender: "", birth_date: "",
    place_of_birth: "", place_of_residence: "",
    lineage: "", notes: ""
  })

  const [others, setOthers] = useState<Member[]>([])
  const [relationTo, setRelationTo] = useState("")
  const [relationType, setRelationType] = useState("parent")

  useEffect(() => {
    const auth = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) router.replace("/login")
    }
    const load = async () => {
      const { data } = await supabase.from("family_members").select("id,name").order("name")
      setOthers((data as Member[]) || [])
    }
    auth(); load()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(null); setSuccess(null)

    const { data, error } = await supabase.from("family_members")
      .insert([form]).select("id").single()

    if (error) setError(error.message)
    else { setSuccess("Member added 🎉"); setNewId(data!.id) }
    setSaving(false)
  }

  const uploadPhoto = async (file: File) => {
    if (!newId) return
    const path = `${newId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: true })
    if (error) { setError(error.message); return }
    const { data: signed } = await supabase.storage.from("photos").createSignedUrl(path, 60*60*24*30)
    if (signed?.signedUrl) {
      await supabase.from("family_members").update({ photo_url: signed.signedUrl }).eq("id", newId)
      setSuccess("Photo uploaded 📷")
    }
  }

  const addRelationship = async () => {
    if (!newId || !relationTo) return
    const { error } = await supabase.from("relationships")
      .insert([{ from_id: newId, to_id: relationTo, relation_type: relationType }])
    if (error) setError(error.message); else setSuccess("Relationship added ✅")
  }

  if (saving) return <LoadingScreen />

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-2xl glass p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">➕ Add Family Member</h1>
        <div className="rasta-line"></div>
        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-rastaGreen">{success}</p>}

        {!newId ? (
          <form onSubmit={saveMember} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required
                     className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div>
              <label className="block text-sm mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required
                      className="w-full rounded p-3 bg-black/40 border border-white/15">
                <option value="">Select…</option>
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Birth Date</label>
              <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange}
                     className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div>
              <label className="block text-sm mb-1">Place of Birth</label>
              <input name="place_of_birth" value={form.place_of_birth} onChange={handleChange}
                     className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div>
              <label className="block text-sm mb-1">Place of Residence</label>
              <input name="place_of_residence" value={form.place_of_residence} onChange={handleChange}
                     className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div>
              <label className="block text-sm mb-1">Lineage (Clan/Tribe)</label>
              <input name="lineage" value={form.lineage} onChange={handleChange}
                     className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                        className="w-full rounded p-3 bg-black/40 border border-white/15"/>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => router.push("/")}
                      className="px-5 py-2 rounded bg-white/10 hover:bg-white/15">Cancel</button>
              <button type="submit"
                      className="px-5 py-2 rounded font-semibold text-black bg-gradient-to-r from-rastaRed via-rastaGold to-rastaGreen">
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block mb-2">Upload Photo</label>
              <input type="file" accept="image/*"
                     onChange={(e) => e.target.files && uploadPhoto(e.target.files[0])}/>
            </div>
            <div>
              <label className="block mb-2">Add Relationship</label>
              <div className="flex gap-2">
                <select value={relationTo} onChange={(e)=>setRelationTo(e.target.value)}
                        className="flex-1 p-2 bg-black/40 border border-white/15 rounded">
                  <option value="">Select person…</option>
                  {others.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <select value={relationType} onChange={(e)=>setRelationType(e.target.value)}
                        className="p-2 bg-black/40 border border-white/15 rounded">
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                </select>
                <button onClick={addRelationship}
                        className="px-4 rounded font-semibold text-black bg-gradient-to-r from-rastaRed via-rastaGold to-rastaGreen">
                  Add
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => router.push("/tree")}
                      className="px-5 py-2 rounded font-semibold text-black bg-gradient-to-r from-rastaGreen to-emerald-500">
                🌳 View Family Tree
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
