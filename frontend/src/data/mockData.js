export const stats = {
  totalQuizzes: 2543,
  activeEvents: 2543,
  students: 2543,
  avgCompletion: 2543
};

export const quizzes = [
  { id: 1, title: 'Introduction to Biology', questions: 15, completions: 28, time: '20 min', rate: 75, status: 'Published' },
  { id: 2, title: 'Introduction to Biology', questions: 15, completions: 28, time: '20 min', rate: 40, status: 'Published' },
  { id: 3, title: 'Introduction to Biology', questions: 15, completions: 28, time: '20 min', rate: 90, status: 'Published' },
  { id: 4, title: 'Advanced Mathematics', questions: 15, completions: 28, time: '20 min', rate: 85, status: 'Published' },
  { id: 5, title: 'Chemistry Fundamentals', questions: 15, completions: 28, time: '20 min', rate: 60, status: 'Draft' }
];

export const events = [
  { id: 1, title: 'Science Mid-term Quiz', desc: 'Basic concepts of biology for beginners', time: 'Today, 2:30 PM', participants: 32, status: 'Active' },
  { id: 2, title: 'Mathematics Weekly Test', desc: 'Basic concepts of biology for beginners', time: 'Tomorrow, 10:00 AM', participants: 28, status: 'Upcoming' },
  { id: 3, title: 'Chemistry Quiz #3', desc: 'Basic concepts of biology for beginners', time: 'May 20, 9:00 AM', participants: 32, status: 'Completed' }
];

export const topStudents = [
  { name: 'Alex John', subject: 'Science', score: 950 },
  { name: 'Emma Watson', subject: 'Mathematics', score: 920 },
  { name: 'Michael Clark', subject: 'Physics', score: 980 },
  { name: 'Sophia Green', subject: 'English', score: 890 },
  { name: 'Lucia Wilde', subject: 'Science', score: 870 }
];

export const students = [
  { name: 'Alex Johnson', class: '10A', quizzesTaken: 12, avgScore: 85, lastActive: '2 hours ago' }
];

export const categories = [
  { name: 'Science & Tech', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
  { name: 'Mathematics', icon: '📐', color: 'from-green-500 to-emerald-500' },
  { name: 'Chemistry', icon: '⚗️', color: 'from-purple-500 to-pink-500' },
  { name: 'Biology', icon: '🧬', color: 'from-pink-500 to-rose-500' },
  { name: 'General Knowledge', icon: '🌍', color: 'from-blue-500 to-indigo-500' },
  { name: 'Current Affairs', icon: '📰', color: 'from-orange-500 to-red-500' }
];

export const sampleQuestions = [
  {
    question: 'Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?',
    options: ['Solar Power', 'Wind Power', 'Natural Gas', 'Hydroelectric Power'],
    correct: 2,
    points: 100,
    difficulty: 'Medium'
  }
];
