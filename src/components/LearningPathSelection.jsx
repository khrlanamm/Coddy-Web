import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code, Smartphone, Database, Brain, Globe, Palette, Server, Shield, Loader2 } from 'lucide-react';
import { fetchLearningPaths } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PATH_METADATA = {
  'Web Development': { icon: Code, color: 'from-blue-500 to-cyan-500', description: 'Pelajari HTML, CSS, JavaScript, React, dan teknologi web modern' },
  'Mobile Development': { icon: Smartphone, color: 'from-purple-500 to-pink-500', description: 'Bangun aplikasi mobile dengan React Native dan Flutter' },
  'Data Science': { icon: Database, color: 'from-green-500 to-teal-500', description: 'Analisis data, machine learning, dan visualisasi data' },
  'Machine Learning': { icon: Brain, color: 'from-orange-500 to-red-500', description: 'Deep learning, AI, dan model prediktif' },
  'Back-End Developer': { icon: Server, color: 'from-teal-500 to-green-500', description: 'Server, database, API, dan cloud computing' }, // Matched DB name usually
  'Front-End Developer': { icon: Globe, color: 'from-indigo-500 to-purple-500', description: 'Frontend development end-to-end' },
  // Add defaults for others
};

const DEFAULT_METADATA = { icon: Code, color: 'from-gray-500 to-slate-500', description: 'Learning Path' };

export function LearningPathSelection({ isDarkMode }) {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchLearningPaths();
      setLearningPaths(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex bg-transparent h-full items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#36BFB0]" />
    </div>
  );

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-teal-50 via-white to-cyan-50'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pilih Learning Path Anda
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Mulai perjalanan pembelajaran Anda dengan memilih path yang sesuai dengan tujuan karir Anda
          </p>
        </motion.div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {learningPaths.map((path, index) => {
            const meta = PATH_METADATA[path.learning_path_name] || DEFAULT_METADATA;
            const Icon = meta.icon;
            
            return (
              <motion.button
                key={path.learning_path_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(`/learning-path/${path.learning_path_id}`)}
                className={`${
                  isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                } border-2 rounded-2xl p-6 text-left transition-all shadow-lg hover:shadow-2xl group flex flex-col h-full`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className={`mb-2 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {path.learning_path_name}
                </h3>

                {/* Description */}
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2 flex-grow`}>
                  {meta.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</span>
                    <span className={`text-xs ${path.progress_percent > 0 ? 'text-[#36BFB0]' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {Math.round(path.progress_percent)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#36BFB0] to-[#2a9d91] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${path.progress_percent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{path.total_courses} kelas</span>
                  <span>{path.total_hours} Jam</span>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#36BFB0] opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat Kurikulum →
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
