"use client"
import Footer from "@/components/Footer"
import "./globals.css"
import { ThemeProvider } from "./ThemeProvider"

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-secondaryColor dark:bg-thirdColor">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

