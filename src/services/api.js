import { supabase } from '../supabaseClient';

// --- Auth Helpers ---

export const signUp = async ({ fullName, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
    });
    if (profileError) throw profileError;
  }

  return data;
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// --- Roadmap Data Helpers ---

export const fetchLearningPaths = async () => {
  const { data, error } = await supabase.rpc('get_learning_paths_with_progress');
  if (error) throw error;
  return data;
};

export const fetchCoursesByLearningPath = async (learningPathId) => {
  const { data, error } = await supabase.rpc('get_courses_by_learning_path', {
    p_learning_path_id: learningPathId,
  });
  if (error) throw error;
  return data;
};

export const updateCourseProgress = async (courseId, isGraduated) => {
  const { error } = await supabase.rpc('set_course_progress', {
    p_course_id: courseId,
    p_is_graduated: isGraduated,
  });
  if (error) throw error;
};


export const askCoddy = async (question) => {
  const { data, error } = await supabase.functions.invoke('coddy-chat', {
    body: { question },
  });

  if (error) {
    console.error('coddy-chat error', error);
    throw error;
  }

  return data;
};
