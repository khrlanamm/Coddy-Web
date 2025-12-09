import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { MessageSquare, Map, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import logo from '../assets/logo.svg'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Coddy Logo" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">Coddy</span>
            <span className="text-[10px] text-muted-foreground leading-none">Your Coding Friends</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Bottom Navbar */}
      <nav className="border-t bg-background">
        <div className="grid h-16 grid-cols-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs font-medium">Chat</span>
          </NavLink>
          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Map className="h-6 w-6" />
            <span className="text-xs font-medium">Roadmap</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
