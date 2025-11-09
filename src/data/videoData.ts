export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  subject: string;
  class: string;
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  views: number;
  likes: number;
}

export const videoData: { [key: string]: { [key: string]: Video[] } } = {
  '1': {
    'mathematics': [
      {
        id: 'math-1-1',
        title: 'Numbers 1 to 10 - Counting and Recognition',
        description: 'Learn to count from 1 to 10 with fun activities and visual aids',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: '/image/thumbnail-math-1.jpg',
        duration: '15:30',
        subject: 'Mathematics',
        class: '1',
        topics: ['Counting', 'Number Recognition', 'Basic Math'],
        difficulty: 'Beginner',
        instructor: 'Ms. Priya Sharma',
        views: 1250,
        likes: 89
      },
      {
        id: 'math-1-2',
        title: 'Shapes and Patterns',
        description: 'Discover different shapes and learn to identify patterns',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: '/image/thumbnail-math-2.jpg',
        duration: '12:45',
        subject: 'Mathematics',
        class: '1',
        topics: ['Shapes', 'Patterns', 'Geometry'],
        difficulty: 'Beginner',
        instructor: 'Mr. Raj Kumar',
        views: 980,
        likes: 67
      }
    ],
    'science': [
      {
        id: 'sci-1-1',
        title: 'Living and Non-Living Things',
        description: 'Understand the difference between living and non-living things',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: '/image/thumbnail-sci-1.jpg',
        duration: '18:20',
        subject: 'Science',
        class: '1',
        topics: ['Living Things', 'Non-Living Things', 'Biology Basics'],
        difficulty: 'Beginner',
        instructor: 'Dr. Anjali Singh',
        views: 2100,
        likes: 156
      }
    ],
    'english': [
      {
        id: 'eng-1-1',
        title: 'Alphabet A to Z - Letter Recognition',
        description: 'Learn all 26 letters of the English alphabet with fun songs and activities',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-eng-1.jpg',
        duration: '20:15',
        subject: 'English',
        class: '1',
        topics: ['Alphabet', 'Letter Recognition', 'Phonics'],
        difficulty: 'Beginner',
        instructor: 'Ms. Sarah Johnson',
        views: 3200,
        likes: 245
      }
    ],
    'hindi': [
      {
        id: 'hin-1-1',
        title: 'Hindi Varnamala - स्वर और व्यंजन',
        description: 'Learn Hindi alphabet with vowels and consonants',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-hin-1.jpg',
        duration: '22:30',
        subject: 'Hindi',
        class: '1',
        topics: ['Hindi Alphabet', 'Vowels', 'Consonants'],
        difficulty: 'Beginner',
        instructor: 'श्रीमती रेखा शर्मा',
        views: 2800,
        likes: 198
      }
    ]
  },
  '2': {
    'mathematics': [
      {
        id: 'math-2-1',
        title: 'Addition and Subtraction Basics',
        description: 'Learn basic addition and subtraction with visual examples',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-math-2-1.jpg',
        duration: '18:45',
        subject: 'Mathematics',
        class: '2',
        topics: ['Addition', 'Subtraction', 'Basic Operations'],
        difficulty: 'Beginner',
        instructor: 'Mr. Amit Verma',
        views: 1500,
        likes: 112
      }
    ],
    'science': [
      {
        id: 'sci-2-1',
        title: 'Plants and Animals Around Us',
        description: 'Learn about different plants and animals in our environment',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-sci-2-1.jpg',
        duration: '16:20',
        subject: 'Science',
        class: '2',
        topics: ['Plants', 'Animals', 'Environment'],
        difficulty: 'Beginner',
        instructor: 'Dr. Priya Patel',
        views: 1800,
        likes: 134
      }
    ]
  },
  '10': {
    'mathematics': [
      {
        id: 'math-10-1',
        title: 'Trigonometry - Sine, Cosine, and Tangent',
        description: 'Master trigonometric ratios and their applications',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-math-10-1.jpg',
        duration: '45:30',
        subject: 'Mathematics',
        class: '10',
        topics: ['Trigonometry', 'Trigonometric Ratios', 'Applications'],
        difficulty: 'Intermediate',
        instructor: 'Prof. Vikram Mehta',
        views: 5600,
        likes: 420
      },
      {
        id: 'math-10-2',
        title: 'Quadratic Equations - Complete Guide',
        description: 'Solve quadratic equations using different methods',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-math-10-2.jpg',
        duration: '52:15',
        subject: 'Mathematics',
        class: '10',
        topics: ['Quadratic Equations', 'Factorization', 'Formula Method'],
        difficulty: 'Intermediate',
        instructor: 'Dr. Neha Gupta',
        views: 4800,
        likes: 380
      },
      {
        id: 'math-10-3',
        title: 'Arithmetic Progressions (AP)',
        description: 'Understand AP concepts, formulas, and problem-solving techniques',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-math-10-3.jpg',
        duration: '38:20',
        subject: 'Mathematics',
        class: '10',
        topics: ['Arithmetic Progressions', 'AP Formulas', 'Problem Solving'],
        difficulty: 'Intermediate',
        instructor: 'Prof. Rajesh Kumar',
        views: 4200,
        likes: 315
      }
    ],
    'physics': [
      {
        id: 'phy-10-1',
        title: 'Light - Reflection and Refraction',
        description: 'Understand the laws of reflection and refraction of light',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-phy-10-1.jpg',
        duration: '38:45',
        subject: 'Physics',
        class: '10',
        topics: ['Light', 'Reflection', 'Refraction', 'Optics'],
        difficulty: 'Intermediate',
        instructor: 'Prof. Amit Kumar',
        views: 3200,
        likes: 245
      },
      {
        id: 'phy-10-2',
        title: 'Electricity - Current and Voltage',
        description: 'Learn about electric current, voltage, and resistance',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-phy-10-2.jpg',
        duration: '42:10',
        subject: 'Physics',
        class: '10',
        topics: ['Electricity', 'Current', 'Voltage', 'Resistance'],
        difficulty: 'Intermediate',
        instructor: 'Dr. Sunita Sharma',
        views: 2900,
        likes: 220
      }
    ],
    'chemistry': [
      {
        id: 'chem-10-1',
        title: 'Acids, Bases, and Salts',
        description: 'Understand the properties and reactions of acids, bases, and salts',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-chem-10-1.jpg',
        duration: '35:25',
        subject: 'Chemistry',
        class: '10',
        topics: ['Acids', 'Bases', 'Salts', 'pH Scale'],
        difficulty: 'Intermediate',
        instructor: 'Dr. Ravi Singh',
        views: 2800,
        likes: 210
      }
    ],
    'biology': [
      {
        id: 'bio-10-1',
        title: 'Life Processes - Nutrition and Respiration',
        description: 'Learn about how living organisms obtain and use energy',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-bio-10-1.jpg',
        duration: '40:15',
        subject: 'Biology',
        class: '10',
        topics: ['Nutrition', 'Respiration', 'Life Processes', 'Energy'],
        difficulty: 'Intermediate',
        instructor: 'Dr. Meera Patel',
        views: 3600,
        likes: 275
      }
    ],
    'english': [
      {
        id: 'eng-10-1',
        title: 'Literature Analysis - Poetry and Prose',
        description: 'Master the art of analyzing poetry and prose in English literature',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-eng-10-1.jpg',
        duration: '33:40',
        subject: 'English',
        class: '10',
        topics: ['Literature Analysis', 'Poetry', 'Prose', 'Critical Thinking'],
        difficulty: 'Intermediate',
        instructor: 'Ms. Jennifer Wilson',
        views: 2400,
        likes: 180
      }
    ],
    'hindi': [
      {
        id: 'hin-10-1',
        title: 'हिंदी व्याकरण - काल और वाच्य',
        description: 'हिंदी व्याकरण में काल और वाच्य की पूरी जानकारी',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-hin-10-1.jpg',
        duration: '28:50',
        subject: 'Hindi',
        class: '10',
        topics: ['हिंदी व्याकरण', 'काल', 'वाच्य', 'व्याकरण नियम'],
        difficulty: 'Intermediate',
        instructor: 'डॉ. राम शर्मा',
        views: 2100,
        likes: 165
      }
    ]
  },
  '11': {
    'mathematics': [
      {
        id: 'math-11-1',
        title: 'Calculus - Limits and Derivatives',
        description: 'Introduction to calculus with limits and derivative concepts',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-math-11-1.jpg',
        duration: '55:20',
        subject: 'Mathematics',
        class: '11',
        topics: ['Calculus', 'Limits', 'Derivatives', 'Differentiation'],
        difficulty: 'Advanced',
        instructor: 'Prof. Arjun Singh',
        views: 6800,
        likes: 520
      }
    ],
    'physics': [
      {
        id: 'phy-11-1',
        title: 'Mechanics - Laws of Motion',
        description: 'Deep dive into Newton\'s laws and mechanical principles',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-phy-11-1.jpg',
        duration: '48:30',
        subject: 'Physics',
        class: '11',
        topics: ['Mechanics', 'Newton\'s Laws', 'Motion', 'Forces'],
        difficulty: 'Advanced',
        instructor: 'Prof. Deepak Verma',
        views: 5200,
        likes: 390
      }
    ],
    'chemistry': [
      {
        id: 'chem-11-1',
        title: 'Atomic Structure and Bonding',
        description: 'Comprehensive study of atomic structure and chemical bonding',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-chem-11-1.jpg',
        duration: '50:15',
        subject: 'Chemistry',
        class: '11',
        topics: ['Atomic Structure', 'Chemical Bonding', 'Electrons', 'Valence'],
        difficulty: 'Advanced',
        instructor: 'Dr. Priya Agarwal',
        views: 4600,
        likes: 340
      }
    ],
    'biology': [
      {
        id: 'bio-11-1',
        title: 'Cell Biology - Structure and Function',
        description: 'Detailed study of cell structure and its various functions',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-bio-11-1.jpg',
        duration: '44:25',
        subject: 'Biology',
        class: '11',
        topics: ['Cell Biology', 'Cell Structure', 'Organelles', 'Cell Function'],
        difficulty: 'Advanced',
        instructor: 'Dr. Anjali Gupta',
        views: 3800,
        likes: 285
      }
    ]
  },
  '12': {
    'mathematics': [
      {
        id: 'math-12-1',
        title: 'Advanced Calculus - Integration',
        description: 'Master integration techniques and applications',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-math-12-1.jpg',
        duration: '60:45',
        subject: 'Mathematics',
        class: '12',
        topics: ['Integration', 'Definite Integrals', 'Applications', 'Calculus'],
        difficulty: 'Advanced',
        instructor: 'Prof. Suresh Kumar',
        views: 7200,
        likes: 580
      }
    ],
    'physics': [
      {
        id: 'phy-12-1',
        title: 'Modern Physics - Quantum Mechanics',
        description: 'Introduction to quantum mechanics and modern physics concepts',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: '/image/thumbnail-phy-12-1.jpg',
        duration: '52:30',
        subject: 'Physics',
        class: '12',
        topics: ['Quantum Mechanics', 'Modern Physics', 'Particles', 'Waves'],
        difficulty: 'Advanced',
        instructor: 'Prof. Rajesh Mehta',
        views: 6100,
        likes: 460
      }
    ],
    'chemistry': [
      {
        id: 'chem-12-1',
        title: 'Organic Chemistry - Reactions and Mechanisms',
        description: 'Comprehensive study of organic reactions and their mechanisms',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: '/image/thumbnail-chem-12-1.jpg',
        duration: '58:20',
        subject: 'Chemistry',
        class: '12',
        topics: ['Organic Chemistry', 'Reactions', 'Mechanisms', 'Synthesis'],
        difficulty: 'Advanced',
        instructor: 'Dr. Neha Sharma',
        views: 5400,
        likes: 410
      }
    ],
    'biology': [
      {
        id: 'bio-12-1',
        title: 'Genetics and Evolution',
        description: 'Study of genetic principles and evolutionary biology',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail: '/image/thumbnail-bio-12-1.jpg',
        duration: '46:35',
        subject: 'Biology',
        class: '12',
        topics: ['Genetics', 'Evolution', 'DNA', 'Heredity'],
        difficulty: 'Advanced',
        instructor: 'Dr. Vikram Patel',
        views: 4200,
        likes: 320
      }
    ]
  }
};

