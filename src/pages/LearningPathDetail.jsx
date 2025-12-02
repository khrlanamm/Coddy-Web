import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCoursesByLearningPath, updateCourseProgress } from '../services/api';
import { ArrowLeft, Clock, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

export default function LearningPathDetail() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // Course ID being updated

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const data = await fetchCoursesByLearningPath(id);
      setCourses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (courseId, currentStatus) => {
    if (updating) return;
    setUpdating(courseId);
    try {
      await updateCourseProgress(courseId, !currentStatus);
      // Optimistic update or refetch
      setCourses(prev => prev.map(c => 
        c.course_id === courseId ? { ...c, is_graduated: !currentStatus } : c
      ));
    } catch (err) {
      console.error('Failed to update progress', err);
      alert('Failed to update progress');
    } finally {
      setUpdating(null);
    }
  };

  // Group courses by level
  const coursesByLevel = courses.reduce((acc, course) => {
    const level = course.level_name;
    if (!acc[level]) acc[level] = [];
    acc[level].push(course);
    return acc;
  }, {});

  // Order levels if needed (assuming API returns them mixed, but usually we want specific order)
  // The user said levels are 1: Dasar, 2: Pemula, etc. 
  // We can rely on the order they appear or sort them if we had level_id.
  // The API returns level_id, so we can sort the keys based on a representative course's level_id.
  const sortedLevels = Object.keys(coursesByLevel).sort((a, b) => {
    const levelIdA = coursesByLevel[a][0].level_id;
    const levelIdB = coursesByLevel[b][0].level_id;
    return levelIdA - levelIdB;
  });

  if (loading) return <div className="text-center text-secondary py-8">Loading courses...</div>;
  if (error) return <div className="text-center text-danger py-8">Error: {error}</div>;

  return (
    <div>
      <Link to="/" className="flex items-center gap-2 text-secondary mb-4 hover:text-white" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Course Curriculum</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {sortedLevels.map(level => (
          <div key={level}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{level}</h2>
            <div className="card" style={{ padding: '0' }}>
              {coursesByLevel[level].map((course, index) => (
                <div 
                  key={course.course_id} 
                  style={{ 
                    padding: '1rem 1.5rem', 
                    borderBottom: index === coursesByLevel[level].length - 1 ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem', color: course.is_graduated ? 'var(--success)' : 'var(--text-primary)' }}>
                      {course.course_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Clock size={14} />
                      <span>{course.hours_to_study} Hours</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleToggle(course.course_id, course.is_graduated)}
                    disabled={updating === course.course_id}
                    className={clsx("btn", course.is_graduated ? "btn-primary" : "btn-outline")}
                    style={{ 
                      borderRadius: '9999px', 
                      width: '40px', 
                      height: '40px', 
                      padding: 0,
                      backgroundColor: course.is_graduated ? 'var(--success)' : 'transparent',
                      borderColor: course.is_graduated ? 'var(--success)' : 'var(--border-color)',
                      opacity: updating === course.course_id ? 0.7 : 1
                    }}
                  >
                    {course.is_graduated ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
