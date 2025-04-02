
import "./globals.css"
import { ThemeProvider } from "./ThemeProvider"

export default function Layout({ children }) {
  return (
    <html lang="en" >
      <body className="bg-secondaryColor dark:bg-thirdColor">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
