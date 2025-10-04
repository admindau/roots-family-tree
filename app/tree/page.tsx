"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dynamic from "next/dynamic"
import LoadingScreen from "@/components/LoadingScreen"

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false })

type Member = { id: string; name: string }
type Relationship = { from_id: string; to_id: string; relation_type: string }
type CustomTreeNode = {
  id: string
  name: string
  relation?: "root" | "parent" | "child" | "spouse"
  children?: CustomTreeNode[]
}

export default function TreePage() {
  const [treeData, setTreeData] = useState<CustomTreeNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: members } = await supabase.from("family_members").select("id,name")
      const { data: relations } = await supabase.from("relationships").select("from_id,to_id,relation_type")

      if (!members || members.length === 0) {
        setTreeData(null)
        setLoading(false)
        return
      }

      const visited = new Set<string>()

      const build = (rootId: string, relation: CustomTreeNode["relation"] = "root"): CustomTreeNode | null => {
        if (visited.has(rootId)) return null
        visited.add(rootId)

        const me = (members as Member[]).find(m => m.id === rootId)
        if (!me) return null

        const children: CustomTreeNode[] = (relations as Relationship[])
          .filter(r => r.from_id === rootId && r.relation_type === "parent")
          .map(r => build(r.to_id, "child"))
          .filter((c): c is CustomTreeNode => c !== null)

        const parents: CustomTreeNode[] = (relations as Relationship[])
          .filter(r => r.to_id === rootId && r.relation_type === "parent")
          .map(r => build(r.from_id, "parent"))
          .filter((p): p is CustomTreeNode => p !== null)

        const spouses: CustomTreeNode[] = (relations as Relationship[])
          .filter(r => (r.from_id === rootId || r.to_id === rootId) && r.relation_type === "spouse")
          .map(r => build(r.from_id === rootId ? r.to_id : r.from_id, "spouse"))
          .filter((s): s is CustomTreeNode => s !== null)

        const merged = [...children, ...spouses, ...parents]
        return { id: me.id, name: me.name, relation, children: merged.length ? merged : undefined }
      }

      const root = build((members as Member[])[0].id, "root")
      setTreeData(root)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <LoadingScreen />

  if (!treeData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>No family tree data found.</p>
      </main>
    )
  }

  const getNodeColor = (relation: CustomTreeNode["relation"]) => {
    switch (relation) {
      case "root": return "#22c55e"
      case "parent": return "#3b82f6"
      case "child": return "#facc15"
      case "spouse": return "#dc2626"
      default: return "#aaa"
    }
  }

  return (
    <main className="h-screen w-screen bg-black text-white">
      <h1 className="text-2xl font-bold text-center py-4">🌳 Family Tree</h1>
      <div style={{ width: "100%", height: "90vh" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 600, y: 120 }}
          collapsible
          renderCustomNodeElement={({ nodeDatum }) => {
            const rel = (nodeDatum as unknown as CustomTreeNode).relation
            return (
              <g>
                <circle r={14} stroke={getNodeColor(rel)} fill="#111" strokeWidth={3} />
                <text fill="#fff" stroke="none" x={20} dy=".35em">
                  {nodeDatum.name}
                </text>
              </g>
            )
          }}
        />
      </div>
    </main>
  )
}
