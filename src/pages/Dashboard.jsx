import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLearningPaths } from '../services/api';
import { Book, Clock, CheckCircle, ArrowRight } from 'lucide-react';

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-50 text-danger rounded-lg text-center">
      Error: {error}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Paths</h1>
        <p className="text-secondary">Select a path to start your coding journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((lp) => (
          <Link 
            key={lp.learning_path_id} 
            to={`/learning-path/${lp.learning_path_id}`} 
            className="card group hover:border-green-500 transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                {lp.learning_path_name}
              </h3>
              <p className="text-sm text-secondary line-clamp-2">
                Master {lp.learning_path_name} with our comprehensive curriculum.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-secondary mb-6">
              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                <Book size={14} />
                <span>{lp.total_courses} Courses</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                <Clock size={14} />
                <span>{lp.total_hours} Hours</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary font-medium">Progress</span>
                <span className="text-accent font-bold">{Math.round(lp.progress_percent)}%</span>
              </div>
              <div className="progress-track mb-4">
                <div 
                  className="progress-fill" 
                  style={{ width: `${lp.progress_percent}%` }}
                ></div>
              </div>
              
              <div className="flex items-center text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
                Continue Learning <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
