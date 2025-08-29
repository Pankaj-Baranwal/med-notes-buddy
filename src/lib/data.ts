// Dummy data for MBBS Study Assistant

export type StudyIntent = 'quick-revision' | 'steady-practice' | 'simplify-basics';

export type StudyIntentData = {
  id: StudyIntent;
  title: string;
  description: string;
  icon: string;
};

export type PDFDocument = {
  id: string;
  title: string;
  author: string;
  subject: string;
  uploadDate: string;
  pageCount: number;
  fileSize: string;
  thumbnail?: string;
};

export type ChatMessage = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
};

export type Citation = {
  document: string;
  chapter: string;
  page: number;
  snippet: string;
};

export type MCQQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type QuizAttempt = {
  id: string;
  title: string;
  questions: MCQQuestion[];
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number; // in minutes
};

// Dummy Data
export const studyIntents: StudyIntentData[] = [
  {
    id: 'quick-revision',
    title: 'Quick Revision',
    description: 'Fast-track your exam prep with instant answers and key concept reviews',
    icon: '⚡'
  },
  {
    id: 'steady-practice',
    title: 'Steady Practice',
    description: 'Build strong foundations with regular MCQ practice and comprehensive study',
    icon: '📚'
  },
  {
    id: 'simplify-basics',
    title: 'Simplify Basics',
    description: 'Break down complex medical concepts into easy-to-understand explanations',
    icon: '🎯'
  }
];

export const dummyPDFs: PDFDocument[] = [
  {
    id: '1',
    title: 'Harrison\'s Principles of Internal Medicine',
    author: 'Jameson, Fauci, Kasper',
    subject: 'Internal Medicine',
    uploadDate: '2024-01-15',
    pageCount: 4568,
    fileSize: '45.2 MB'
  },
  {
    id: '2',
    title: 'Gray\'s Anatomy for Students',
    author: 'Richard Drake, A. Wayne Vogl',
    subject: 'Anatomy',
    uploadDate: '2024-01-10',
    pageCount: 1194,
    fileSize: '78.5 MB'
  },
  {
    id: '3',
    title: 'Robbins Basic Pathology',
    author: 'Vinay Kumar, Abul Abbas',
    subject: 'Pathology',
    uploadDate: '2024-01-08',
    pageCount: 910,
    fileSize: '52.1 MB'
  }
];

export const dummyChatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'What are the main causes of myocardial infarction?',
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'assistant',
    content: 'The main causes of myocardial infarction include:\n\n1. **Coronary artery disease (CAD)** - Most common cause\n2. **Atherosclerotic plaque rupture** - Leading to thrombosis\n3. **Coronary artery spasm** - Can cause temporary blockage\n4. **Coronary embolism** - Less common but significant\n\nThe pathophysiology involves reduced blood flow to the myocardium, leading to ischemia and eventual tissue death if not promptly treated.',
    timestamp: '2024-01-20T10:30:15Z',
    citations: [
      {
        document: 'Harrison\'s Principles of Internal Medicine',
        chapter: 'Acute Myocardial Infarction',
        page: 1599,
        snippet: 'The most common cause of MI is atherothrombosis, which occurs when...'
      },
      {
        document: 'Harrison\'s Principles of Internal Medicine',
        chapter: 'Coronary Artery Disease',
        page: 1587,
        snippet: 'Plaque rupture exposes the thrombogenic core to circulating blood...'
      }
    ]
  },
  {
    id: '3',
    type: 'user',
    content: 'Can you explain the difference between STEMI and NSTEMI?',
    timestamp: '2024-01-20T10:35:00Z'
  },
  {
    id: '4',
    type: 'assistant',
    content: 'STEMI and NSTEMI are two main types of myocardial infarction:\n\n**STEMI (ST-Elevation MI):**\n- Complete coronary artery occlusion\n- ST elevation on ECG in 2+ contiguous leads\n- Transmural (full-thickness) myocardial damage\n- Requires immediate reperfusion therapy\n\n**NSTEMI (Non-ST-Elevation MI):**\n- Partial coronary artery occlusion\n- No ST elevation (may show ST depression or T-wave changes)\n- Subendocardial myocardial damage\n- More stable, allows time for optimal medical therapy\n\nBoth require troponin elevation for diagnosis, but treatment urgency differs significantly.',
    timestamp: '2024-01-20T10:35:20Z',
    citations: [
      {
        document: 'Harrison\'s Principles of Internal Medicine',
        chapter: 'Acute Coronary Syndromes',
        page: 1593,
        snippet: 'STEMI represents complete occlusion of a coronary artery...'
      }
    ]
  }
];

export const dummyMCQs: MCQQuestion[] = [
  {
    id: '1',
    question: 'Which of the following is the most common cause of myocardial infarction?',
    options: [
      'Coronary artery spasm',
      'Atherosclerotic plaque rupture',
      'Coronary embolism',
      'Aortic dissection'
    ],
    correctAnswer: 1,
    explanation: 'Atherosclerotic plaque rupture is the most common cause of MI, accounting for approximately 70% of cases. The rupture exposes thrombogenic material, leading to thrombus formation and vessel occlusion.',
    chapter: 'Acute Myocardial Infarction',
    difficulty: 'medium'
  },
  {
    id: '2',
    question: 'What is the gold standard biomarker for diagnosing myocardial infarction?',
    options: [
      'CK-MB',
      'Myoglobin',
      'Troponin I/T',
      'LDH'
    ],
    correctAnswer: 2,
    explanation: 'Troponin I and T are the gold standard biomarkers for MI diagnosis due to their high sensitivity and specificity for myocardial injury. They remain elevated for several days after the event.',
    chapter: 'Cardiac Biomarkers',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'In STEMI, what is the target time for door-to-balloon intervention?',
    options: [
      '60 minutes',
      '90 minutes',
      '120 minutes',
      '180 minutes'
    ],
    correctAnswer: 1,
    explanation: 'The target door-to-balloon time for STEMI patients is 90 minutes or less. This rapid intervention is crucial for minimizing myocardial damage and improving patient outcomes.',
    chapter: 'STEMI Management',
    difficulty: 'medium'
  }
];

export const dummyQuizAttempts: QuizAttempt[] = [
  {
    id: '1',
    title: 'Cardiology - Acute MI Quiz',
    questions: dummyMCQs,
    score: 2,
    totalQuestions: 3,
    completedAt: '2024-01-20T11:00:00Z',
    timeSpent: 8
  },
  {
    id: '2',
    title: 'Pathology - Basic Concepts',
    questions: dummyMCQs.slice(0, 2),
    score: 1,
    totalQuestions: 2,
    completedAt: '2024-01-19T15:30:00Z',
    timeSpent: 12
  }
];