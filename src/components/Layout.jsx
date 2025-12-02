import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/api';
import { LogOut, User, BookOpen, MessageCircle } from 'lucide-react';

export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: '1rem 0' }}>
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
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
                {user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                <LogOut size={14} style={{ marginRight: '0.25rem' }} />
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
