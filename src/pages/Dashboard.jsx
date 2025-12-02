import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLearningPaths } from '../services/api';
import { Book, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLearningPaths();
        setLearningPaths(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="text-center text-secondary py-8">Loading learning paths...</div>;
  if (error) return <div className="text-center text-danger py-8">Error: {error}</div>;

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Learning Paths</h1>
      <p className="text-secondary mb-4" style={{ marginBottom: '2rem' }}>Select a path to start learning</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {learningPaths.map((lp) => (
          <Link key={lp.learning_path_id} to={`/learning-path/${lp.learning_path_id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{lp.learning_path_name}</h3>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-secondary" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-2">
                <Book size={16} />
                <span>{lp.total_courses} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{lp.total_hours} Hours</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div className="flex justify-between text-sm mb-4" style={{ marginBottom: '0.5rem' }}>
                <span className="text-secondary">Progress</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{Math.round(lp.progress_percent)}%</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${lp.progress_percent}%` }}
                ></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
