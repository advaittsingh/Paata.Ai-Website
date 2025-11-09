export interface Chapter {
  id: string;
  title: string;
  description: string;
  number: number;
  videos: {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    duration: string;
  }[];
  pdfs: {
    id: string;
    title: string;
    url: string;
    size: string;
    pages?: number;
  }[];
  topics: string[];
}

export interface SubjectChapters {
  [subject: string]: {
    [classNumber: string]: Chapter[];
  };
}

// Test video URLs (Google's sample videos)
const testVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ZoomForUnity.mp4'
];

// Test PDF URL
const testPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// Helper to get video URL by index (cycling through)
function getVideoUrl(index: number): string {
  return testVideos[index % testVideos.length];
}

// Helper to create a chapter
function createChapter(
  id: string,
  title: string,
  description: string,
  number: number,
  videoCount: number = 2,
  pdfCount: number = 2,
  topics: string[] = []
): Chapter {
  const videos = Array.from({ length: videoCount }, (_, i) => ({
    id: `v${id}-${i + 1}`,
    title: `${title} - Video ${i + 1}`,
    url: getVideoUrl((parseInt(id.replace(/\D/g, '')) || 0) + i),
    thumbnail: '/image/thumbnail-default.jpg',
    duration: `${10 + i * 5}:${30 + i * 10}`
  }));

  const pdfs = Array.from({ length: pdfCount }, (_, i) => ({
    id: `p${id}-${i + 1}`,
    title: `${title} - Workbook ${i + 1}`,
    url: testPdfUrl,
    size: `${2 + i * 0.5} MB`,
    pages: 15 + i * 5
  }));

  return {
    id,
    title,
    description,
    number,
    videos,
    pdfs,
    topics
  };
}

// Comprehensive chapter data for all classes and subjects
export const chapterData: SubjectChapters = {
  mathematics: {
    '1': [
      createChapter('math-1-ch1', 'Numbers from 1 to 9', 'Learn to count and recognize numbers from 1 to 9', 1, 2, 2, ['Counting', 'Number Recognition', 'Number Writing']),
      createChapter('math-1-ch2', 'Shapes and Patterns', 'Identify basic shapes and create patterns', 2, 1, 1, ['Shapes', 'Patterns', 'Geometry']),
      createChapter('math-1-ch3', 'Addition Basics', 'Learn simple addition with numbers 1-10', 3, 2, 1, ['Addition', 'Sum', 'Counting']),
      createChapter('math-1-ch4', 'Subtraction Basics', 'Learn simple subtraction with numbers 1-10', 4, 1, 1, ['Subtraction', 'Difference', 'Counting'])
    ],
    '2': [
      createChapter('math-2-ch1', 'Addition and Subtraction', 'Learn addition and subtraction with larger numbers', 1, 2, 2, ['Addition', 'Subtraction', 'Arithmetic']),
      createChapter('math-2-ch2', 'Multiplication Basics', 'Introduction to multiplication tables', 2, 2, 1, ['Multiplication', 'Tables', 'Times']),
      createChapter('math-2-ch3', 'Division Basics', 'Introduction to division', 3, 1, 1, ['Division', 'Quotient', 'Remainder']),
      createChapter('math-2-ch4', 'Measurement', 'Learn about length, weight, and capacity', 4, 1, 1, ['Measurement', 'Length', 'Weight'])
    ],
    '3': [
      createChapter('math-3-ch1', 'Fractions', 'Understanding fractions and their uses', 1, 2, 2, ['Fractions', 'Numerator', 'Denominator']),
      createChapter('math-3-ch2', 'Time and Calendar', 'Learn to read time and understand calendar', 2, 1, 1, ['Time', 'Clock', 'Calendar']),
      createChapter('math-3-ch3', 'Money', 'Understanding currency and basic money operations', 3, 1, 1, ['Money', 'Currency', 'Coins']),
      createChapter('math-3-ch4', 'Data Handling', 'Introduction to collecting and organizing data', 4, 1, 1, ['Data', 'Graphs', 'Charts'])
    ],
    '4': [
      createChapter('math-4-ch1', 'Decimals', 'Understanding decimal numbers', 1, 2, 2, ['Decimals', 'Place Value', 'Decimal Operations']),
      createChapter('math-4-ch2', 'Geometry Basics', 'Introduction to lines, angles, and shapes', 2, 2, 1, ['Geometry', 'Lines', 'Angles']),
      createChapter('math-4-ch3', 'Perimeter and Area', 'Calculate perimeter and area of shapes', 3, 1, 1, ['Perimeter', 'Area', 'Measurement']),
      createChapter('math-4-ch4', 'Symmetry', 'Understanding symmetry in shapes', 4, 1, 1, ['Symmetry', 'Reflection', 'Patterns'])
    ],
    '5': [
      createChapter('math-5-ch1', 'Algebra Basics', 'Introduction to variables and expressions', 1, 2, 2, ['Algebra', 'Variables', 'Expressions']),
      createChapter('math-5-ch2', 'Advanced Geometry', 'Triangles, quadrilaterals, and circles', 2, 2, 1, ['Triangles', 'Quadrilaterals', 'Circles']),
      createChapter('math-5-ch3', 'Volume and Capacity', 'Understanding volume and capacity', 3, 1, 1, ['Volume', 'Capacity', '3D Shapes']),
      createChapter('math-5-ch4', 'Statistics', 'Introduction to mean, median, and mode', 4, 1, 1, ['Statistics', 'Mean', 'Median'])
    ],
    '6': [
      createChapter('math-6-ch1', 'Integers', 'Understanding positive and negative numbers', 1, 2, 2, ['Integers', 'Positive', 'Negative']),
      createChapter('math-6-ch2', 'Algebraic Expressions', 'Working with algebraic expressions', 2, 2, 1, ['Algebra', 'Expressions', 'Equations']),
      createChapter('math-6-ch3', 'Ratio and Proportion', 'Understanding ratios and proportions', 3, 1, 1, ['Ratio', 'Proportion', 'Scaling']),
      createChapter('math-6-ch4', 'Basic Statistics', 'Introduction to data representation', 4, 1, 1, ['Statistics', 'Data', 'Graphs'])
    ],
    '7': [
      createChapter('math-7-ch1', 'Integers and Rational Numbers', 'Advanced number systems', 1, 2, 2, ['Integers', 'Rational Numbers', 'Number Line']),
      createChapter('math-7-ch2', 'Linear Equations', 'Solving linear equations in one variable', 2, 2, 1, ['Equations', 'Linear', 'Solving']),
      createChapter('math-7-ch3', 'Lines and Angles', 'Properties of lines and angles', 3, 1, 1, ['Lines', 'Angles', 'Parallel']),
      createChapter('math-7-ch4', 'Triangles and Congruence', 'Properties of triangles', 4, 1, 1, ['Triangles', 'Congruence', 'Properties'])
    ],
    '8': [
      createChapter('math-8-ch1', 'Rational Numbers', 'Operations with rational numbers', 1, 2, 2, ['Rational Numbers', 'Operations', 'Fractions']),
      createChapter('math-8-ch2', 'Linear Equations', 'Solving linear equations', 2, 2, 1, ['Equations', 'Linear', 'Algebra']),
      createChapter('math-8-ch3', 'Quadrilaterals', 'Properties of quadrilaterals', 3, 1, 1, ['Quadrilaterals', 'Properties', 'Geometry']),
      createChapter('math-8-ch4', 'Mensuration', 'Area and volume calculations', 4, 1, 1, ['Mensuration', 'Area', 'Volume'])
    ],
    '9': [
      createChapter('math-9-ch1', 'Number Systems', 'Real numbers and their properties', 1, 2, 2, ['Number Systems', 'Real Numbers', 'Irrational']),
      createChapter('math-9-ch2', 'Polynomials', 'Introduction to polynomials', 2, 2, 1, ['Polynomials', 'Algebra', 'Expressions']),
      createChapter('math-9-ch3', 'Coordinate Geometry', 'Plotting points on coordinate plane', 3, 1, 1, ['Coordinates', 'Graphs', 'Plane']),
      createChapter('math-9-ch4', 'Linear Equations in Two Variables', 'Solving systems of equations', 4, 1, 1, ['Equations', 'Two Variables', 'Systems'])
    ],
    '10': [
      createChapter('math-10-ch1', 'Real Numbers', 'Properties of real numbers', 1, 2, 2, ['Real Numbers', 'Properties', 'Operations']),
      createChapter('math-10-ch2', 'Polynomials', 'Advanced polynomial operations', 2, 2, 1, ['Polynomials', 'Factorization', 'Division']),
      createChapter('math-10-ch3', 'Pair of Linear Equations', 'Solving pairs of linear equations', 3, 1, 1, ['Linear Equations', 'Pairs', 'Solving']),
      createChapter('math-10-ch4', 'Quadratic Equations', 'Introduction to quadratic equations', 4, 1, 1, ['Quadratic', 'Equations', 'Roots'])
    ],
    '11': [
      createChapter('math-11-ch1', 'Sets', 'Introduction to sets and set theory', 1, 2, 2, ['Sets', 'Set Theory', 'Operations']),
      createChapter('math-11-ch2', 'Relations and Functions', 'Understanding relations and functions', 2, 2, 1, ['Relations', 'Functions', 'Mapping']),
      createChapter('math-11-ch3', 'Trigonometric Functions', 'Introduction to trigonometry', 3, 1, 1, ['Trigonometry', 'Functions', 'Angles']),
      createChapter('math-11-ch4', 'Complex Numbers', 'Working with complex numbers', 4, 1, 1, ['Complex Numbers', 'Imaginary', 'Operations'])
    ],
    '12': [
      createChapter('math-12-ch1', 'Relations and Functions', 'Advanced function concepts', 1, 2, 2, ['Functions', 'Relations', 'Advanced']),
      createChapter('math-12-ch2', 'Inverse Trigonometric Functions', 'Inverse trig functions', 2, 2, 1, ['Inverse Trig', 'Functions', 'Properties']),
      createChapter('math-12-ch3', 'Matrices', 'Introduction to matrices', 3, 1, 1, ['Matrices', 'Operations', 'Determinants']),
      createChapter('math-12-ch4', 'Determinants', 'Working with determinants', 4, 1, 1, ['Determinants', 'Matrices', 'Properties'])
    ]
  },
  science: {
    '1': [
      createChapter('sci-1-ch1', 'Living and Non-Living Things', 'Understand the difference between living and non-living things', 1, 1, 1, ['Living Things', 'Non-Living Things', 'Characteristics']),
      createChapter('sci-1-ch2', 'Plants Around Us', 'Learn about different types of plants', 2, 1, 1, ['Plants', 'Trees', 'Flowers']),
      createChapter('sci-1-ch3', 'Animals Around Us', 'Learn about different animals', 3, 1, 1, ['Animals', 'Wild', 'Domestic']),
      createChapter('sci-1-ch4', 'Our Body', 'Understanding our body parts', 4, 1, 1, ['Body', 'Parts', 'Health'])
    ],
    '2': [
      createChapter('sci-2-ch1', 'Animals and Their Homes', 'Learn about different animals and where they live', 1, 1, 1, ['Animals', 'Habitats', 'Homes']),
      createChapter('sci-2-ch2', 'Food We Eat', 'Understanding different types of food', 2, 1, 1, ['Food', 'Nutrition', 'Health']),
      createChapter('sci-2-ch3', 'Water', 'Importance of water and water cycle', 3, 1, 1, ['Water', 'Cycle', 'Conservation']),
      createChapter('sci-2-ch4', 'Air Around Us', 'Understanding air and atmosphere', 4, 1, 1, ['Air', 'Atmosphere', 'Wind'])
    ],
    '3': [
      createChapter('sci-3-ch1', 'Human Body', 'Understanding human body systems', 1, 2, 2, ['Human Body', 'Systems', 'Organs']),
      createChapter('sci-3-ch2', 'Weather and Seasons', 'Understanding weather patterns', 2, 1, 1, ['Weather', 'Seasons', 'Climate']),
      createChapter('sci-3-ch3', 'Materials Around Us', 'Different types of materials', 3, 1, 1, ['Materials', 'Properties', 'Uses']),
      createChapter('sci-3-ch4', 'Light, Sound, and Force', 'Basic concepts of light, sound, and force', 4, 1, 1, ['Light', 'Sound', 'Force'])
    ],
    '4': [
      createChapter('sci-4-ch1', 'Force, Work, and Energy', 'Understanding force, work, and energy', 1, 2, 2, ['Force', 'Work', 'Energy']),
      createChapter('sci-4-ch2', 'Simple Machines', 'Introduction to simple machines', 2, 1, 1, ['Machines', 'Simple', 'Mechanics']),
      createChapter('sci-4-ch3', 'States of Matter', 'Solid, liquid, and gas', 3, 1, 1, ['Matter', 'States', 'Properties']),
      createChapter('sci-4-ch4', 'Our Universe', 'Planets, stars, and space', 4, 1, 1, ['Universe', 'Planets', 'Stars'])
    ],
    '5': [
      createChapter('sci-5-ch1', 'Matter and Its Properties', 'Understanding matter and its properties', 1, 2, 2, ['Matter', 'Properties', 'Changes']),
      createChapter('sci-5-ch2', 'Energy and Its Forms', 'Different forms of energy', 2, 1, 1, ['Energy', 'Forms', 'Transformation']),
      createChapter('sci-5-ch3', 'Natural Resources', 'Understanding natural resources', 3, 1, 1, ['Resources', 'Natural', 'Conservation']),
      createChapter('sci-5-ch4', 'Environmental Science', 'Protecting our environment', 4, 1, 1, ['Environment', 'Conservation', 'Protection'])
    ],
    '6': [
      createChapter('sci-6-ch1', 'Food: Where Does It Come From?', 'Sources of food', 1, 2, 2, ['Food', 'Sources', 'Nutrition']),
      createChapter('sci-6-ch2', 'Components of Food', 'Nutrients and their importance', 2, 1, 1, ['Food', 'Nutrients', 'Components']),
      createChapter('sci-6-ch3', 'Fibre to Fabric', 'How fabric is made', 3, 1, 1, ['Fabric', 'Fibre', 'Textiles']),
      createChapter('sci-6-ch4', 'Sorting Materials into Groups', 'Classifying materials', 4, 1, 1, ['Materials', 'Classification', 'Properties'])
    ]
  },
  english: {
    '1': [
      createChapter('eng-1-ch1', 'Alphabet and Phonics', 'Learn the English alphabet and basic phonics', 1, 2, 1, ['Alphabet', 'Phonics', 'Letters']),
      createChapter('eng-1-ch2', 'Simple Words', 'Learn to read and write simple words', 2, 1, 1, ['Words', 'Reading', 'Writing']),
      createChapter('eng-1-ch3', 'Simple Sentences', 'Forming simple sentences', 3, 1, 1, ['Sentences', 'Grammar', 'Structure']),
      createChapter('eng-1-ch4', 'Stories and Poems', 'Reading simple stories and poems', 4, 1, 1, ['Stories', 'Poems', 'Reading'])
    ],
    '2': [
      createChapter('eng-2-ch1', 'Sentences', 'Learn to form simple sentences', 1, 1, 1, ['Sentences', 'Grammar', 'Structure']),
      createChapter('eng-2-ch2', 'Nouns and Pronouns', 'Understanding nouns and pronouns', 2, 1, 1, ['Nouns', 'Pronouns', 'Grammar']),
      createChapter('eng-2-ch3', 'Verbs', 'Introduction to verbs', 3, 1, 1, ['Verbs', 'Action', 'Grammar']),
      createChapter('eng-2-ch4', 'Reading Comprehension', 'Understanding what you read', 4, 1, 1, ['Reading', 'Comprehension', 'Understanding'])
    ],
    '3': [
      createChapter('eng-3-ch1', 'Advanced Grammar', 'Parts of speech and sentence structure', 1, 2, 2, ['Grammar', 'Parts of Speech', 'Structure']),
      createChapter('eng-3-ch2', 'Creative Writing', 'Writing stories and essays', 2, 1, 1, ['Writing', 'Creative', 'Stories']),
      createChapter('eng-3-ch3', 'Poetry', 'Understanding and writing poetry', 3, 1, 1, ['Poetry', 'Rhyme', 'Verse']),
      createChapter('eng-3-ch4', 'Literature', 'Reading and analyzing literature', 4, 1, 1, ['Literature', 'Analysis', 'Reading'])
    ],
    '4': [
      createChapter('eng-4-ch1', 'Creative Writing', 'Advanced creative writing techniques', 1, 2, 2, ['Writing', 'Creative', 'Techniques']),
      createChapter('eng-4-ch2', 'Grammar and Vocabulary', 'Advanced grammar and vocabulary building', 2, 1, 1, ['Grammar', 'Vocabulary', 'Language']),
      createChapter('eng-4-ch3', 'Reading Skills', 'Improving reading comprehension', 3, 1, 1, ['Reading', 'Comprehension', 'Skills']),
      createChapter('eng-4-ch4', 'Communication', 'Effective communication skills', 4, 1, 1, ['Communication', 'Skills', 'Speaking'])
    ],
    '5': [
      createChapter('eng-5-ch1', 'Advanced Literature', 'Analyzing complex literature', 1, 2, 2, ['Literature', 'Analysis', 'Critical Thinking']),
      createChapter('eng-5-ch2', 'Writing Skills', 'Advanced writing techniques', 2, 1, 1, ['Writing', 'Techniques', 'Skills']),
      createChapter('eng-5-ch3', 'Grammar Mastery', 'Mastering English grammar', 3, 1, 1, ['Grammar', 'Mastery', 'Rules']),
      createChapter('eng-5-ch4', 'Critical Analysis', 'Critical thinking and analysis', 4, 1, 1, ['Analysis', 'Critical Thinking', 'Evaluation'])
    ],
    '6': [
      createChapter('eng-6-ch1', 'Literature Analysis', 'Analyzing literary works', 1, 2, 2, ['Literature', 'Analysis', 'Literary Devices']),
      createChapter('eng-6-ch2', 'Writing Skills', 'Advanced writing and composition', 2, 1, 1, ['Writing', 'Composition', 'Skills']),
      createChapter('eng-6-ch3', 'Grammar and Usage', 'Advanced grammar rules', 3, 1, 1, ['Grammar', 'Usage', 'Rules']),
      createChapter('eng-6-ch4', 'Communication', 'Effective written and oral communication', 4, 1, 1, ['Communication', 'Writing', 'Speaking'])
    ],
    '7': [
      createChapter('eng-7-ch1', 'Advanced Literature', 'Complex literary analysis', 1, 2, 2, ['Literature', 'Analysis', 'Themes']),
      createChapter('eng-7-ch2', 'Composition', 'Advanced composition techniques', 2, 1, 1, ['Composition', 'Writing', 'Techniques']),
      createChapter('eng-7-ch3', 'Grammar Excellence', 'Mastering advanced grammar', 3, 1, 1, ['Grammar', 'Advanced', 'Mastery']),
      createChapter('eng-7-ch4', 'Critical Reading', 'Critical reading and analysis', 4, 1, 1, ['Reading', 'Critical', 'Analysis'])
    ],
    '8': [
      createChapter('eng-8-ch1', 'Literature and Writing', 'Advanced literature and writing', 1, 2, 2, ['Literature', 'Writing', 'Advanced']),
      createChapter('eng-8-ch2', 'Language Skills', 'Comprehensive language skills', 2, 1, 1, ['Language', 'Skills', 'Communication']),
      createChapter('eng-8-ch3', 'Literary Devices', 'Understanding literary devices', 3, 1, 1, ['Literary Devices', 'Figures of Speech', 'Analysis']),
      createChapter('eng-8-ch4', 'Essay Writing', 'Mastering essay writing', 4, 1, 1, ['Essay', 'Writing', 'Structure'])
    ],
    '9': [
      createChapter('eng-9-ch1', 'Literature and Critical Analysis', 'Advanced literary analysis', 1, 2, 2, ['Literature', 'Analysis', 'Critical']),
      createChapter('eng-9-ch2', 'Advanced Writing', 'Professional writing skills', 2, 1, 1, ['Writing', 'Professional', 'Skills']),
      createChapter('eng-9-ch3', 'Grammar Mastery', 'Complete grammar mastery', 3, 1, 1, ['Grammar', 'Mastery', 'Advanced']),
      createChapter('eng-9-ch4', 'Communication Excellence', 'Excellence in communication', 4, 1, 1, ['Communication', 'Excellence', 'Skills'])
    ],
    '10': [
      createChapter('eng-10-ch1', 'Literature and Board Preparation', 'Preparing for board exams', 1, 2, 2, ['Literature', 'Board Exams', 'Preparation']),
      createChapter('eng-10-ch2', 'Writing for Exams', 'Exam writing techniques', 2, 1, 1, ['Writing', 'Exams', 'Techniques']),
      createChapter('eng-10-ch3', 'Grammar for Exams', 'Grammar for competitive exams', 3, 1, 1, ['Grammar', 'Exams', 'Competitive']),
      createChapter('eng-10-ch4', 'Reading Comprehension', 'Advanced reading comprehension', 4, 1, 1, ['Reading', 'Comprehension', 'Advanced'])
    ],
    '11': [
      createChapter('eng-11-ch1', 'Literature and Communication', 'Advanced literature studies', 1, 2, 2, ['Literature', 'Communication', 'Advanced']),
      createChapter('eng-11-ch2', 'Professional Writing', 'Professional and academic writing', 2, 1, 1, ['Writing', 'Professional', 'Academic']),
      createChapter('eng-11-ch3', 'Language Mastery', 'Complete language mastery', 3, 1, 1, ['Language', 'Mastery', 'Advanced']),
      createChapter('eng-11-ch4', 'Critical Analysis', 'Advanced critical analysis', 4, 1, 1, ['Analysis', 'Critical', 'Advanced'])
    ],
    '12': [
      createChapter('eng-12-ch1', 'Literature and Competitive Prep', 'Preparing for competitive exams', 1, 2, 2, ['Literature', 'Competitive', 'Preparation']),
      createChapter('eng-12-ch2', 'Advanced Writing', 'Master-level writing skills', 2, 1, 1, ['Writing', 'Advanced', 'Master']),
      createChapter('eng-12-ch3', 'Grammar Excellence', 'Grammar for competitive exams', 3, 1, 1, ['Grammar', 'Excellence', 'Competitive']),
      createChapter('eng-12-ch4', 'Communication Mastery', 'Master-level communication', 4, 1, 1, ['Communication', 'Mastery', 'Advanced'])
    ]
  },
  hindi: {
    '1': [
      createChapter('hin-1-ch1', 'हिंदी वर्णमाला', 'Learn the Hindi alphabet (वर्णमाला)', 1, 1, 1, ['वर्णमाला', 'अक्षर', 'हिंदी']),
      createChapter('hin-1-ch2', 'सरल शब्द', 'Learn simple Hindi words', 2, 1, 1, ['शब्द', 'पढ़ना', 'लिखना']),
      createChapter('hin-1-ch3', 'सरल वाक्य', 'Forming simple sentences in Hindi', 3, 1, 1, ['वाक्य', 'व्याकरण', 'संरचना']),
      createChapter('hin-1-ch4', 'कहानियाँ', 'Reading simple Hindi stories', 4, 1, 1, ['कहानियाँ', 'पढ़ना', 'समझ'])
    ],
    '2': [
      createChapter('hin-2-ch1', 'हिंदी पढ़ना और लिखना', 'Hindi reading and writing skills', 1, 1, 1, ['पढ़ना', 'लिखना', 'कौशल']),
      createChapter('hin-2-ch2', 'व्याकरण', 'Basic Hindi grammar', 2, 1, 1, ['व्याकरण', 'नियम', 'हिंदी']),
      createChapter('hin-2-ch3', 'शब्दावली', 'Building Hindi vocabulary', 3, 1, 1, ['शब्दावली', 'शब्द', 'भाषा']),
      createChapter('hin-2-ch4', 'कहानियाँ और कविताएँ', 'Stories and poems in Hindi', 4, 1, 1, ['कहानियाँ', 'कविताएँ', 'साहित्य'])
    ],
    '3': [
      createChapter('hin-3-ch1', 'हिंदी व्याकरण', 'Advanced Hindi grammar', 1, 2, 2, ['व्याकरण', 'उन्नत', 'हिंदी']),
      createChapter('hin-3-ch2', 'साहित्य', 'Hindi literature and poetry', 2, 1, 1, ['साहित्य', 'कविता', 'साहित्यिक']),
      createChapter('hin-3-ch3', 'लेखन कौशल', 'Hindi writing skills', 3, 1, 1, ['लेखन', 'कौशल', 'रचना']),
      createChapter('hin-3-ch4', 'समझ और विश्लेषण', 'Comprehension and analysis', 4, 1, 1, ['समझ', 'विश्लेषण', 'पढ़ना'])
    ],
    '4': [
      createChapter('hin-4-ch1', 'उन्नत हिंदी व्याकरण', 'Advanced Hindi grammar and stories', 1, 2, 2, ['व्याकरण', 'उन्नत', 'कहानियाँ']),
      createChapter('hin-4-ch2', 'हिंदी साहित्य', 'Hindi literature studies', 2, 1, 1, ['साहित्य', 'अध्ययन', 'हिंदी']),
      createChapter('hin-4-ch3', 'रचनात्मक लेखन', 'Creative writing in Hindi', 3, 1, 1, ['लेखन', 'रचनात्मक', 'कौशल']),
      createChapter('hin-4-ch4', 'भाषा कौशल', 'Language skills in Hindi', 4, 1, 1, ['भाषा', 'कौशल', 'संचार'])
    ],
    '5': [
      createChapter('hin-5-ch1', 'हिंदी कविता और साहित्य', 'Hindi poetry and advanced literature', 1, 2, 2, ['कविता', 'साहित्य', 'उन्नत']),
      createChapter('hin-5-ch2', 'व्याकरण महारत', 'Grammar mastery in Hindi', 2, 1, 1, ['व्याकरण', 'महारत', 'नियम']),
      createChapter('hin-5-ch3', 'लेखन उत्कृष्टता', 'Writing excellence in Hindi', 3, 1, 1, ['लेखन', 'उत्कृष्टता', 'कौशल']),
      createChapter('hin-5-ch4', 'समालोचनात्मक विश्लेषण', 'Critical analysis in Hindi', 4, 1, 1, ['विश्लेषण', 'समालोचनात्मक', 'अध्ययन'])
    ],
    '6': [
      createChapter('hin-6-ch1', 'हिंदी व्याकरण और साहित्य', 'Hindi grammar and literature', 1, 2, 2, ['व्याकरण', 'साहित्य', 'हिंदी']),
      createChapter('hin-6-ch2', 'साहित्यिक विश्लेषण', 'Literary analysis in Hindi', 2, 1, 1, ['विश्लेषण', 'साहित्यिक', 'अध्ययन']),
      createChapter('hin-6-ch3', 'उन्नत लेखन', 'Advanced writing in Hindi', 3, 1, 1, ['लेखन', 'उन्नत', 'कौशल']),
      createChapter('hin-6-ch4', 'संचार कौशल', 'Communication skills in Hindi', 4, 1, 1, ['संचार', 'कौशल', 'भाषा'])
    ],
    '7': [
      createChapter('hin-7-ch1', 'हिंदी साहित्य और उन्नत व्याकरण', 'Hindi literature and advanced grammar', 1, 2, 2, ['साहित्य', 'व्याकरण', 'उन्नत']),
      createChapter('hin-7-ch2', 'साहित्यिक रचनाएँ', 'Literary compositions in Hindi', 2, 1, 1, ['रचनाएँ', 'साहित्यिक', 'लेखन']),
      createChapter('hin-7-ch3', 'भाषा महारत', 'Language mastery in Hindi', 3, 1, 1, ['भाषा', 'महारत', 'कौशल']),
      createChapter('hin-7-ch4', 'समालोचनात्मक पढ़ना', 'Critical reading in Hindi', 4, 1, 1, ['पढ़ना', 'समालोचनात्मक', 'विश्लेषण'])
    ],
    '8': [
      createChapter('hin-8-ch1', 'हिंदी कविता और गद्य', 'Hindi poetry and prose', 1, 2, 2, ['कविता', 'गद्य', 'साहित्य']),
      createChapter('hin-8-ch2', 'साहित्यिक अध्ययन', 'Literary studies in Hindi', 2, 1, 1, ['अध्ययन', 'साहित्यिक', 'हिंदी']),
      createChapter('hin-8-ch3', 'उत्कृष्ट लेखन', 'Excellence in Hindi writing', 3, 1, 1, ['लेखन', 'उत्कृष्ट', 'कौशल']),
      createChapter('hin-8-ch4', 'भाषा कला', 'Language arts in Hindi', 4, 1, 1, ['भाषा', 'कला', 'संचार'])
    ],
    '9': [
      createChapter('hin-9-ch1', 'हिंदी साहित्य और व्याकरण', 'Hindi literature and grammar', 1, 2, 2, ['साहित्य', 'व्याकरण', 'हिंदी']),
      createChapter('hin-9-ch2', 'साहित्यिक विश्लेषण', 'Advanced literary analysis', 2, 1, 1, ['विश्लेषण', 'साहित्यिक', 'उन्नत']),
      createChapter('hin-9-ch3', 'रचनात्मक उत्कृष्टता', 'Creative excellence in Hindi', 3, 1, 1, ['रचनात्मक', 'उत्कृष्टता', 'लेखन']),
      createChapter('hin-9-ch4', 'भाषा कौशल महारत', 'Language skills mastery', 4, 1, 1, ['भाषा', 'कौशल', 'महारत'])
    ],
    '10': [
      createChapter('hin-10-ch1', 'हिंदी साहित्य और बोर्ड तैयारी', 'Hindi literature and board prep', 1, 2, 2, ['साहित्य', 'बोर्ड', 'तैयारी']),
      createChapter('hin-10-ch2', 'परीक्षा लेखन', 'Exam writing in Hindi', 2, 1, 1, ['लेखन', 'परीक्षा', 'तकनीक']),
      createChapter('hin-10-ch3', 'व्याकरण उत्कृष्टता', 'Grammar excellence for exams', 3, 1, 1, ['व्याकरण', 'उत्कृष्टता', 'परीक्षा']),
      createChapter('hin-10-ch4', 'समझ कौशल', 'Advanced comprehension skills', 4, 1, 1, ['समझ', 'कौशल', 'उन्नत'])
    ],
    '11': [
      createChapter('hin-11-ch1', 'हिंदी साहित्य और व्याकरण', 'Hindi literature and grammar', 1, 2, 2, ['साहित्य', 'व्याकरण', 'हिंदी']),
      createChapter('hin-11-ch2', 'साहित्यिक अध्ययन', 'Advanced literary studies', 2, 1, 1, ['अध्ययन', 'साहित्यिक', 'उन्नत']),
      createChapter('hin-11-ch3', 'लेखन महारत', 'Writing mastery in Hindi', 3, 1, 1, ['लेखन', 'महारत', 'कौशल']),
      createChapter('hin-11-ch4', 'भाषा उत्कृष्टता', 'Language excellence', 4, 1, 1, ['भाषा', 'उत्कृष्टता', 'संचार'])
    ],
    '12': [
      createChapter('hin-12-ch1', 'हिंदी साहित्य और प्रतिस्पर्धी तैयारी', 'Hindi literature and competitive prep', 1, 2, 2, ['साहित्य', 'प्रतिस्पर्धी', 'तैयारी']),
      createChapter('hin-12-ch2', 'उन्नत लेखन', 'Master-level writing in Hindi', 2, 1, 1, ['लेखन', 'उन्नत', 'महारत']),
      createChapter('hin-12-ch3', 'व्याकरण महारत', 'Grammar mastery for competitive exams', 3, 1, 1, ['व्याकरण', 'महारत', 'प्रतिस्पर्धी']),
      createChapter('hin-12-ch4', 'संचार महारत', 'Master-level communication', 4, 1, 1, ['संचार', 'महारत', 'उन्नत'])
    ]
  },
  physics: {
    '7': [
      createChapter('phy-7-ch1', 'Motion, Force, and Energy', 'Understanding motion, force, and energy', 1, 2, 2, ['Motion', 'Force', 'Energy']),
      createChapter('phy-7-ch2', 'Light', 'Properties of light', 2, 1, 1, ['Light', 'Reflection', 'Refraction']),
      createChapter('phy-7-ch3', 'Sound', 'Understanding sound waves', 3, 1, 1, ['Sound', 'Waves', 'Frequency']),
      createChapter('phy-7-ch4', 'Electricity', 'Basic concepts of electricity', 4, 1, 1, ['Electricity', 'Current', 'Voltage'])
    ],
    '8': [
      createChapter('phy-8-ch1', 'Light, Sound, and Electricity', 'Advanced concepts of light, sound, and electricity', 1, 2, 2, ['Light', 'Sound', 'Electricity']),
      createChapter('phy-8-ch2', 'Force and Pressure', 'Understanding force and pressure', 2, 1, 1, ['Force', 'Pressure', 'Mechanics']),
      createChapter('phy-8-ch3', 'Friction', 'Understanding friction', 3, 1, 1, ['Friction', 'Force', 'Motion']),
      createChapter('phy-8-ch4', 'Stars and Solar System', 'Understanding celestial bodies', 4, 1, 1, ['Stars', 'Solar System', 'Planets'])
    ],
    '9': [
      createChapter('phy-9-ch1', 'Mechanics and Thermodynamics', 'Advanced mechanics and thermodynamics', 1, 2, 2, ['Mechanics', 'Thermodynamics', 'Energy']),
      createChapter('phy-9-ch2', 'Motion', 'Detailed study of motion', 2, 1, 1, ['Motion', 'Velocity', 'Acceleration']),
      createChapter('phy-9-ch3', 'Force and Laws of Motion', 'Newton\'s laws of motion', 3, 1, 1, ['Force', 'Newton', 'Laws']),
      createChapter('phy-9-ch4', 'Gravitation', 'Understanding gravitation', 4, 1, 1, ['Gravitation', 'Gravity', 'Force'])
    ],
    '10': [
      createChapter('phy-10-ch1', 'Optics and Modern Physics', 'Optics and modern physics concepts', 1, 2, 2, ['Optics', 'Modern Physics', 'Light']),
      createChapter('phy-10-ch2', 'Light - Reflection and Refraction', 'Detailed study of light', 2, 1, 1, ['Light', 'Reflection', 'Refraction']),
      createChapter('phy-10-ch3', 'Human Eye and Colorful World', 'Understanding human eye', 3, 1, 1, ['Eye', 'Vision', 'Color']),
      createChapter('phy-10-ch4', 'Electricity', 'Advanced electricity concepts', 4, 1, 1, ['Electricity', 'Current', 'Circuits'])
    ],
    '11': [
      createChapter('phy-11-ch1', 'Mechanics and Waves', 'Advanced mechanics and wave motion', 1, 2, 2, ['Mechanics', 'Waves', 'Motion']),
      createChapter('phy-11-ch2', 'Physical World and Measurement', 'Fundamentals of physics', 2, 1, 1, ['Physics', 'Measurement', 'Units']),
      createChapter('phy-11-ch3', 'Kinematics', 'Study of motion', 3, 1, 1, ['Kinematics', 'Motion', 'Velocity']),
      createChapter('phy-11-ch4', 'Laws of Motion', 'Newton\'s laws', 4, 1, 1, ['Laws', 'Motion', 'Newton'])
    ],
    '12': [
      createChapter('phy-12-ch1', 'Modern Physics and Electronics', 'Modern physics and electronics', 1, 2, 2, ['Modern Physics', 'Electronics', 'Quantum']),
      createChapter('phy-12-ch2', 'Electric Charges and Fields', 'Understanding electric charges', 2, 1, 1, ['Electricity', 'Charges', 'Fields']),
      createChapter('phy-12-ch3', 'Electromagnetic Waves', 'Electromagnetic wave theory', 3, 1, 1, ['Electromagnetic', 'Waves', 'Radiation']),
      createChapter('phy-12-ch4', 'Optics', 'Advanced optics', 4, 1, 1, ['Optics', 'Light', 'Waves'])
    ]
  },
  chemistry: {
    '7': [
      createChapter('chem-7-ch1', 'Elements, Compounds, and Reactions', 'Understanding elements and compounds', 1, 2, 2, ['Elements', 'Compounds', 'Reactions']),
      createChapter('chem-7-ch2', 'Acids, Bases, and Salts', 'Understanding acids, bases, and salts', 2, 1, 1, ['Acids', 'Bases', 'Salts']),
      createChapter('chem-7-ch3', 'Physical and Chemical Changes', 'Types of changes', 3, 1, 1, ['Physical', 'Chemical', 'Changes']),
      createChapter('chem-7-ch4', 'Air and Water', 'Properties of air and water', 4, 1, 1, ['Air', 'Water', 'Properties'])
    ],
    '8': [
      createChapter('chem-8-ch1', 'Acids, Bases, and Chemical Bonding', 'Understanding chemical bonding', 1, 2, 2, ['Acids', 'Bases', 'Bonding']),
      createChapter('chem-8-ch2', 'Materials: Metals and Non-Metals', 'Properties of metals and non-metals', 2, 1, 1, ['Metals', 'Non-Metals', 'Properties']),
      createChapter('chem-8-ch3', 'Coal and Petroleum', 'Understanding fossil fuels', 3, 1, 1, ['Coal', 'Petroleum', 'Fuels']),
      createChapter('chem-8-ch4', 'Combustion and Flame', 'Understanding combustion', 4, 1, 1, ['Combustion', 'Flame', 'Fire'])
    ],
    '9': [
      createChapter('chem-9-ch1', 'Atomic Structure and Periodic Table', 'Understanding atomic structure', 1, 2, 2, ['Atomic Structure', 'Periodic Table', 'Elements']),
      createChapter('chem-9-ch2', 'Matter in Our Surroundings', 'States of matter', 2, 1, 1, ['Matter', 'States', 'Properties']),
      createChapter('chem-9-ch3', 'Is Matter Around Us Pure?', 'Understanding pure substances', 3, 1, 1, ['Matter', 'Pure', 'Mixtures']),
      createChapter('chem-9-ch4', 'Atoms and Molecules', 'Understanding atoms and molecules', 4, 1, 1, ['Atoms', 'Molecules', 'Structure'])
    ],
    '10': [
      createChapter('chem-10-ch1', 'Organic and Inorganic Chemistry', 'Introduction to organic and inorganic chemistry', 1, 2, 2, ['Organic', 'Inorganic', 'Chemistry']),
      createChapter('chem-10-ch2', 'Chemical Reactions and Equations', 'Understanding chemical reactions', 2, 1, 1, ['Reactions', 'Equations', 'Balance']),
      createChapter('chem-10-ch3', 'Acids, Bases, and Salts', 'Detailed study of acids and bases', 3, 1, 1, ['Acids', 'Bases', 'Salts']),
      createChapter('chem-10-ch4', 'Metals and Non-Metals', 'Properties and reactions', 4, 1, 1, ['Metals', 'Non-Metals', 'Reactions'])
    ],
    '11': [
      createChapter('chem-11-ch1', 'Physical and Organic Chemistry', 'Physical and organic chemistry fundamentals', 1, 2, 2, ['Physical', 'Organic', 'Chemistry']),
      createChapter('chem-11-ch2', 'Some Basic Concepts of Chemistry', 'Fundamental concepts', 2, 1, 1, ['Concepts', 'Fundamentals', 'Chemistry']),
      createChapter('chem-11-ch3', 'Structure of Atom', 'Atomic structure', 3, 1, 1, ['Atom', 'Structure', 'Electrons']),
      createChapter('chem-11-ch4', 'Classification of Elements', 'Periodic classification', 4, 1, 1, ['Elements', 'Classification', 'Periodic'])
    ],
    '12': [
      createChapter('chem-12-ch1', 'Advanced Organic Chemistry', 'Advanced organic chemistry concepts', 1, 2, 2, ['Organic', 'Advanced', 'Chemistry']),
      createChapter('chem-12-ch2', 'The Solid State', 'Understanding solid state', 2, 1, 1, ['Solid', 'State', 'Structure']),
      createChapter('chem-12-ch3', 'Solutions', 'Understanding solutions', 3, 1, 1, ['Solutions', 'Concentration', 'Properties']),
      createChapter('chem-12-ch4', 'Electrochemistry', 'Electrochemical processes', 4, 1, 1, ['Electrochemistry', 'Cells', 'Reactions'])
    ]
  },
  biology: {
    '7': [
      createChapter('bio-7-ch1', 'Cell Biology and Life Processes', 'Understanding cells and life processes', 1, 2, 2, ['Cells', 'Biology', 'Life Processes']),
      createChapter('bio-7-ch2', 'Nutrition in Plants', 'How plants get nutrition', 2, 1, 1, ['Nutrition', 'Plants', 'Photosynthesis']),
      createChapter('bio-7-ch3', 'Nutrition in Animals', 'How animals get nutrition', 3, 1, 1, ['Nutrition', 'Animals', 'Digestion']),
      createChapter('bio-7-ch4', 'Respiration in Organisms', 'Understanding respiration', 4, 1, 1, ['Respiration', 'Organisms', 'Breathing'])
    ],
    '8': [
      createChapter('bio-8-ch1', 'Reproduction and Genetics', 'Understanding reproduction and genetics', 1, 2, 2, ['Reproduction', 'Genetics', 'Heredity']),
      createChapter('bio-8-ch2', 'Cell - Structure and Functions', 'Understanding cell structure', 2, 1, 1, ['Cell', 'Structure', 'Functions']),
      createChapter('bio-8-ch3', 'Microorganisms', 'Understanding microorganisms', 3, 1, 1, ['Microorganisms', 'Bacteria', 'Viruses']),
      createChapter('bio-8-ch4', 'Conservation of Plants and Animals', 'Conservation biology', 4, 1, 1, ['Conservation', 'Plants', 'Animals'])
    ],
    '9': [
      createChapter('bio-9-ch1', 'Cell Division and Evolution', 'Understanding cell division and evolution', 1, 2, 2, ['Cell Division', 'Evolution', 'Genetics']),
      createChapter('bio-9-ch2', 'The Fundamental Unit of Life', 'Understanding cells', 2, 1, 1, ['Cell', 'Life', 'Structure']),
      createChapter('bio-9-ch3', 'Tissues', 'Understanding tissues', 3, 1, 1, ['Tissues', 'Structure', 'Functions']),
      createChapter('bio-9-ch4', 'Diversity in Living Organisms', 'Biodiversity', 4, 1, 1, ['Diversity', 'Organisms', 'Classification'])
    ],
    '10': [
      createChapter('bio-10-ch1', 'Ecology and Biotechnology', 'Understanding ecology and biotechnology', 1, 2, 2, ['Ecology', 'Biotechnology', 'Environment']),
      createChapter('bio-10-ch2', 'Life Processes', 'Understanding life processes', 2, 1, 1, ['Life Processes', 'Metabolism', 'Respiration']),
      createChapter('bio-10-ch3', 'Control and Coordination', 'Nervous and endocrine systems', 3, 1, 1, ['Control', 'Coordination', 'Nervous System']),
      createChapter('bio-10-ch4', 'How Do Organisms Reproduce?', 'Reproduction in organisms', 4, 1, 1, ['Reproduction', 'Organisms', 'Biology'])
    ],
    '11': [
      createChapter('bio-11-ch1', 'Botany and Zoology', 'Introduction to botany and zoology', 1, 2, 2, ['Botany', 'Zoology', 'Biology']),
      createChapter('bio-11-ch2', 'The Living World', 'Understanding living organisms', 2, 1, 1, ['Living World', 'Organisms', 'Classification']),
      createChapter('bio-11-ch3', 'Biological Classification', 'Classifying living organisms', 3, 1, 1, ['Classification', 'Biology', 'Taxonomy']),
      createChapter('bio-11-ch4', 'Plant Kingdom', 'Understanding plant kingdom', 4, 1, 1, ['Plants', 'Kingdom', 'Classification'])
    ],
    '12': [
      createChapter('bio-12-ch1', 'Advanced Botany and Zoology', 'Advanced botany and zoology concepts', 1, 2, 2, ['Botany', 'Zoology', 'Advanced']),
      createChapter('bio-12-ch2', 'Reproduction in Organisms', 'Understanding reproduction', 2, 1, 1, ['Reproduction', 'Organisms', 'Biology']),
      createChapter('bio-12-ch3', 'Sexual Reproduction in Flowering Plants', 'Plant reproduction', 3, 1, 1, ['Reproduction', 'Plants', 'Flowers']),
      createChapter('bio-12-ch4', 'Human Reproduction', 'Human reproductive system', 4, 1, 1, ['Reproduction', 'Human', 'Biology'])
    ]
  },
  'social studies': {
    '6': [
      createChapter('ss-6-ch1', 'History, Geography, and Civics', 'Introduction to social studies', 1, 2, 2, ['History', 'Geography', 'Civics']),
      createChapter('ss-6-ch2', 'What, Where, How and When?', 'Understanding history', 2, 1, 1, ['History', 'Sources', 'Evidence']),
      createChapter('ss-6-ch3', 'From Hunting-Gathering to Growing Food', 'Early human history', 3, 1, 1, ['History', 'Early Humans', 'Agriculture']),
      createChapter('ss-6-ch4', 'The Earth in the Solar System', 'Understanding our planet', 4, 1, 1, ['Earth', 'Solar System', 'Geography'])
    ],
    '9': [
      createChapter('ss-9-ch1', 'History and Political Science', 'Understanding history and politics', 1, 2, 2, ['History', 'Political Science', 'Governance']),
      createChapter('ss-9-ch2', 'The French Revolution', 'Understanding the French Revolution', 2, 1, 1, ['History', 'Revolution', 'France']),
      createChapter('ss-9-ch3', 'Socialism in Europe', 'History of socialism', 3, 1, 1, ['History', 'Socialism', 'Europe']),
      createChapter('ss-9-ch4', 'Nazism and the Rise of Hitler', 'World War II history', 4, 1, 1, ['History', 'Nazism', 'World War'])
    ],
    '10': [
      createChapter('ss-10-ch1', 'History and Geography', 'Comprehensive history and geography', 1, 2, 2, ['History', 'Geography', 'Social Studies']),
      createChapter('ss-10-ch2', 'The Rise of Nationalism in Europe', 'European nationalism', 2, 1, 1, ['History', 'Nationalism', 'Europe']),
      createChapter('ss-10-ch3', 'Nationalism in India', 'Indian independence movement', 3, 1, 1, ['History', 'Nationalism', 'India']),
      createChapter('ss-10-ch4', 'Resources and Development', 'Geography and resources', 4, 1, 1, ['Geography', 'Resources', 'Development'])
    ]
  },
  'computer science': {
    '6': [
      createChapter('cs-6-ch1', 'Basic Programming and Computer Concepts', 'Introduction to computers and programming', 1, 2, 2, ['Programming', 'Computers', 'Basics']),
      createChapter('cs-6-ch2', 'Introduction to Computers', 'Understanding computers', 2, 1, 1, ['Computers', 'Hardware', 'Software']),
      createChapter('cs-6-ch3', 'Basic Programming', 'Introduction to programming', 3, 1, 1, ['Programming', 'Code', 'Logic']),
      createChapter('cs-6-ch4', 'Internet and Web', 'Understanding internet', 4, 1, 1, ['Internet', 'Web', 'Network'])
    ],
    '9': [
      createChapter('cs-9-ch1', 'Programming and Algorithms', 'Advanced programming and algorithms', 1, 2, 2, ['Programming', 'Algorithms', 'Logic']),
      createChapter('cs-9-ch2', 'Python Programming', 'Introduction to Python', 2, 1, 1, ['Python', 'Programming', 'Code']),
      createChapter('cs-9-ch3', 'Data Structures', 'Understanding data structures', 3, 1, 1, ['Data Structures', 'Algorithms', 'Programming']),
      createChapter('cs-9-ch4', 'Database Concepts', 'Introduction to databases', 4, 1, 1, ['Database', 'SQL', 'Data'])
    ],
    '10': [
      createChapter('cs-10-ch1', 'Advanced Programming', 'Master-level programming concepts', 1, 2, 2, ['Programming', 'Advanced', 'Algorithms']),
      createChapter('cs-10-ch2', 'Object-Oriented Programming', 'OOP concepts', 2, 1, 1, ['OOP', 'Programming', 'Objects']),
      createChapter('cs-10-ch3', 'Data Structures and Algorithms', 'Advanced algorithms', 3, 1, 1, ['Algorithms', 'Data Structures', 'Complexity']),
      createChapter('cs-10-ch4', 'Web Development', 'Introduction to web development', 4, 1, 1, ['Web', 'Development', 'HTML'])
    ],
    '11': [
      createChapter('cs-11-ch1', 'Programming and Databases', 'Advanced programming and database concepts', 1, 2, 2, ['Programming', 'Databases', 'Advanced']),
      createChapter('cs-11-ch2', 'Computer Systems', 'Understanding computer systems', 2, 1, 1, ['Systems', 'Hardware', 'Software']),
      createChapter('cs-11-ch3', 'Programming Methodology', 'Programming best practices', 3, 1, 1, ['Programming', 'Methodology', 'Best Practices']),
      createChapter('cs-11-ch4', 'Data Management', 'Database management', 4, 1, 1, ['Database', 'Management', 'SQL'])
    ],
    '12': [
      createChapter('cs-12-ch1', 'Advanced Programming and AI', 'Advanced programming and artificial intelligence', 1, 2, 2, ['Programming', 'AI', 'Advanced']),
      createChapter('cs-12-ch2', 'Data Structures', 'Advanced data structures', 2, 1, 1, ['Data Structures', 'Advanced', 'Algorithms']),
      createChapter('cs-12-ch3', 'Database Management Systems', 'Advanced database concepts', 3, 1, 1, ['Database', 'Management', 'Advanced']),
      createChapter('cs-12-ch4', 'Computer Networks', 'Understanding networks', 4, 1, 1, ['Networks', 'Internet', 'Protocols'])
    ]
  },
  economics: {
    '11': [
      createChapter('eco-11-ch1', 'Micro and Macro Economics', 'Introduction to micro and macro economics', 1, 2, 2, ['Micro', 'Macro', 'Economics']),
      createChapter('eco-11-ch2', 'Introduction to Economics', 'Basic economic concepts', 2, 1, 1, ['Economics', 'Concepts', 'Basics']),
      createChapter('eco-11-ch3', 'Consumer Behavior', 'Understanding consumer behavior', 3, 1, 1, ['Consumer', 'Behavior', 'Demand']),
      createChapter('eco-11-ch4', 'Production and Cost', 'Production theory', 4, 1, 1, ['Production', 'Cost', 'Theory'])
    ],
    '12': [
      createChapter('eco-12-ch1', 'Advanced Economics', 'Advanced economic theories and concepts', 1, 2, 2, ['Economics', 'Advanced', 'Theories']),
      createChapter('eco-12-ch2', 'National Income', 'Understanding national income', 2, 1, 1, ['National Income', 'GDP', 'Economics']),
      createChapter('eco-12-ch3', 'Money and Banking', 'Monetary economics', 3, 1, 1, ['Money', 'Banking', 'Finance']),
      createChapter('eco-12-ch4', 'Government Budget', 'Fiscal policy', 4, 1, 1, ['Budget', 'Government', 'Fiscal'])
    ]
  },
  accountancy: {
    '11': [
      createChapter('acc-11-ch1', 'Financial Accounting', 'Introduction to financial accounting', 1, 2, 2, ['Accounting', 'Financial', 'Basics']),
      createChapter('acc-11-ch2', 'Introduction to Accounting', 'Basic accounting concepts', 2, 1, 1, ['Accounting', 'Concepts', 'Principles']),
      createChapter('acc-11-ch3', 'Recording of Transactions', 'Journal and ledger', 3, 1, 1, ['Transactions', 'Journal', 'Ledger']),
      createChapter('acc-11-ch4', 'Trial Balance', 'Understanding trial balance', 4, 1, 1, ['Trial Balance', 'Accounts', 'Balance'])
    ],
    '12': [
      createChapter('acc-12-ch1', 'Advanced Accounting', 'Advanced accounting concepts and practices', 1, 2, 2, ['Accounting', 'Advanced', 'Financial']),
      createChapter('acc-12-ch2', 'Accounting for Partnership', 'Partnership accounting', 2, 1, 1, ['Partnership', 'Accounting', 'Business']),
      createChapter('acc-12-ch3', 'Company Accounts', 'Corporate accounting', 3, 1, 1, ['Company', 'Accounts', 'Corporate']),
      createChapter('acc-12-ch4', 'Financial Statements', 'Understanding financial statements', 4, 1, 1, ['Financial Statements', 'Balance Sheet', 'Income'])
    ]
  },
  'business studies': {
    '11': [
      createChapter('bs-11-ch1', 'Business Management', 'Introduction to business management', 1, 2, 2, ['Business', 'Management', 'Organization']),
      createChapter('bs-11-ch2', 'Nature and Purpose of Business', 'Understanding business', 2, 1, 1, ['Business', 'Nature', 'Purpose']),
      createChapter('bs-11-ch3', 'Forms of Business Organization', 'Types of business organizations', 3, 1, 1, ['Business', 'Organization', 'Forms']),
      createChapter('bs-11-ch4', 'Private and Public Sector', 'Sector classification', 4, 1, 1, ['Private', 'Public', 'Sector'])
    ],
    '12': [
      createChapter('bs-12-ch1', 'Advanced Business Management', 'Advanced business management concepts', 1, 2, 2, ['Business', 'Management', 'Advanced']),
      createChapter('bs-12-ch2', 'Nature and Significance of Management', 'Management principles', 2, 1, 1, ['Management', 'Principles', 'Significance']),
      createChapter('bs-12-ch3', 'Principles of Management', 'Management theories', 3, 1, 1, ['Management', 'Principles', 'Theories']),
      createChapter('bs-12-ch4', 'Business Environment', 'Understanding business environment', 4, 1, 1, ['Business', 'Environment', 'Factors'])
    ]
  }
};

// Helper function to get chapters for a subject and class
export function getChaptersForSubject(subject: string, classNumber: string): Chapter[] {
  const subjectKey = subject.toLowerCase();
  return chapterData[subjectKey]?.[classNumber] || [];
}

// Helper function to get a specific chapter
export function getChapter(subject: string, classNumber: string, chapterId: string): Chapter | null {
  const chapters = getChaptersForSubject(subject, classNumber);
  return chapters.find(ch => ch.id === chapterId) || null;
}
