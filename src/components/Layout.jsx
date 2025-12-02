import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/api';
import { LogOut, User, MessageCircle, Loader2, Menu, X } from 'lucide-react';
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile';
import coddyLogo from '../assets/coddy.png';
import { useState } from 'react';

export default function Layout() {
  const { user } = useAuth();
  const { profile } = useCurrentUserProfile();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <header className="relative bg-white border-b border-gray-200 shadow-sm z-50" style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <img src={coddyLogo} alt="Coddy Logo" style={{ width: '32px', height: '32px' }} />
            <span>Coddy Roadmap</span>
          </Link>
          
          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-4" style={{ display: 'flex' }}>
              <Link to="/coddy-chat" className="btn btn-outline gap-2 text-sm">
                <MessageCircle size={18} />
                Ask Coddy
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-secondary px-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-accent">
                  <User size={18} />
                </div>
                <span className="font-medium">
                  {profile?.full_name 
                    ? profile.full_name.split(' ').slice(0, 2).join(' ') 
                    : user.email?.split('@')[0]}
                </span>
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-ghost text-danger gap-2 text-sm hover:bg-red-50"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-secondary hover:text-primary"
            onClick={toggleMobileMenu}
            style={{ display: 'none' }} // Hidden on desktop via CSS, but inline style for now as we transition
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation (Simple Stack for now, can be improved with CSS classes later if needed) */}
        {/* Note: In a real responsive implementation, we'd use media queries to show/hide the desktop/mobile menus. 
            For now, I'll rely on the 'hidden md:flex' classes I added to index.css if I had Tailwind, 
            but since I'm using vanilla CSS, I'll add a simple style block here or rely on the index.css updates.
            Wait, I didn't add 'md:flex' etc to index.css. I should stick to standard CSS media queries or simple styles.
            Let's adjust the desktop nav to be responsive using a simple media query in style tag or just keep it simple.
        */}
      </header>

      {/* Since I didn't add Tailwind-like classes for hiding/showing, let's just make the header responsive using standard CSS in index.css or inline styles for now. 
          Actually, I'll update the Layout to be simpler and just wrap the user actions.
      */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <main className="flex-1 py-8">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-secondary bg-white" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Coddy Roadmap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
