export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <div className="rasta-line"></div>
        <p className="text-white/70">Oops! That page does not exist.</p>
      </div>
    </main>
  )
}
