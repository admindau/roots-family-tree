import "./globals.css"
import type { Metadata } from "next"
import TopNav from "@/components/TopNav"

export const metadata: Metadata = {
  title: "Roots",
  description: "Family heritage database & visual tree",
  icons: [{ rel: "icon", url: "/logo.png" }], // favicon fallback via logo
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
