import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/api';
import { LogOut, User, BookOpen, MessageCircle, Loader2 } from 'lucide-react';
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile';
import coddyLogo from '../assets/coddy.png';
import { useState } from 'react';

export default function Layout() {
  const { user } = useAuth();
  const { profile } = useCurrentUserProfile();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'white', padding: '1rem 0', boxShadow: 'var(--shadow-sm)' }}>
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            <img src={coddyLogo} alt="Coddy Logo" style={{ width: '24px', height: '24px' }} />
            Coddy Roadmap
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/coddy-chat" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={16} />
                Ask Coddy
              </Link>
              <span className="text-sm text-secondary flex items-center gap-2">
                <User size={16} />
                {profile?.full_name 
                  ? profile.full_name.split(' ').slice(0, 2).join(' ') 
                  : user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" disabled={isLoggingOut} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isLoggingOut ? <Loader2 className="animate-spin" size={14} /> : <LogOut size={14} />}
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <div className="container">
          &copy; {new Date().getFullYear()} Coddy Roadmap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
