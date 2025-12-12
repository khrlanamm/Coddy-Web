import React, { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { MessageSquare, Map, Sun, Moon, LogOut, User } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../services/api'
import logo from '../assets/logo.svg'
import { cn } from './ui/utils'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { user, profile } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Get display name (Profile full_name or Email prefix)
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

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
        
        <div className="flex items-center gap-3">
          {/* User Chip */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User size={14} />
              </div>
              <span className="max-w-[100px] truncate">{displayName}</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
            
            {/* Click outside closer overlay */}
            {showUserMenu && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
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
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              isActive 
                ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs font-medium">Chat</span>
          </NavLink>
          <NavLink
            to="/roadmap"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              isActive 
                ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Map className="h-6 w-6" />
            <span className="text-xs font-medium">Roadmap</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
