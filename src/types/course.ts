export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  options: ExamOption[];
  correctOption: string;
  explanation?: string;
}

export interface ExamData {
  id: string;
  title: string;
  totalQuestions: number;
  durationSeconds: number; // e.g. 1334 (22:14)
  questions: ExamQuestion[];
}

export interface PdfContent {
  courseName?: string;
  chapterTitle?: string;
  summary?: string;
  keyRuleTitle?: string;
  keyRuleText?: string;
  checklist?: string[];
}

export interface LessonItem {
  id: string;
  title: string;
  type: 'video' | 'exam' | 'pdf';
  duration: string;
  badgeQuestions?: string;
  badgeDuration?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  pdfPages?: number;
  completed: boolean;
  isCurrent?: boolean;
  description?: string;
  examData?: ExamData;
  pdfContent?: PdfContent;
}

export interface CurriculumSection {
  id: string;
  week: string; // e.g., "Week 1-4"
  mobileTitle?: string; // e.g., "Course Introduction" for Mobile Figma
  title: string; // e.g., "Advanced story telling techniques for writers: Persona characters and plot"
  lessons: LessonItem[];
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  content: string;
  likes?: number;
}

export interface CourseMaterialItem {
  id: string;
  label: string;
  value: string;
  iconName: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  lessonsCount: number;
  enrolledCount: number;
  quizzesCount: number;
  language: string;
  certificate: boolean;
  access: string;
  rating: number;
  reviewsCount: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0 to 100
  curriculum: CurriculumSection[];
  materials: CourseMaterialItem[];
  comments: CommentItem[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  completedLessons: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface MentorQuote {
  minProgress: number;
  maxProgress: number;
  quote: string;
  emoji: string;
  levelName: string;
}
