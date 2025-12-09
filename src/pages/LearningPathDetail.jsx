import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCoursesByLearningPath, updateCourseProgress } from '../services/api';
import { ArrowLeft, Clock, CheckCircle, Circle, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../components/ui/utils';

export default function LearningPathDetail() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

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
      setCourses(prev => prev.map(c => 
        c.course_id === courseId ? { ...c, is_graduated: !currentStatus } : c
      ));
    } catch (err) {
      console.error('Failed to update progress', err);
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

  const sortedLevels = Object.keys(coursesByLevel).sort((a, b) => {
    const levelIdA = coursesByLevel[a][0].level_id;
    const levelIdB = coursesByLevel[b][0].level_id;
    return levelIdA - levelIdB;
  });

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#36BFB0]" />
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-destructive">
      Error: {error}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/roadmap" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Course Curriculum</h1>
          <p className="text-muted-foreground mt-2">Master your skills with this comprehensive path</p>
        </div>

        <div className="space-y-8">
          {sortedLevels.map(level => (
            <div key={level} className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#36BFB0]" />
                <h2 className="text-xl font-semibold text-foreground">{level}</h2>
              </div>
              
              <Card className="border-0 shadow-sm bg-background">
                <CardContent className="p-0 divide-y divide-border">
                  {coursesByLevel[level].map((course) => (
                    <div 
                      key={course.course_id} 
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className={cn(
                          "font-medium mb-1 truncate",
                          course.is_graduated ? "text-green-600 dark:text-green-500" : "text-foreground"
                        )}>
                          {course.course_name}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.hours_to_study} Hours</span>
                          </div>
                          {course.is_graduated && (
                            <span className="text-green-600 dark:text-green-500 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(course.course_id, course.is_graduated)}
                        disabled={updating === course.course_id}
                        className={cn(
                          "rounded-full w-10 h-10 shrink-0",
                          course.is_graduated 
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                         {updating === course.course_id ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                         ) : course.is_graduated ? (
                           <CheckCircle className="w-6 h-6 fill-green-100 dark:fill-green-900" />
                         ) : (
                           <Circle className="w-6 h-6" />
                         )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
