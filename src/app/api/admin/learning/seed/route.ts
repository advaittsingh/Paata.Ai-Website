import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';
import { verifyAdmin } from '@/lib/admin-utils';
import { chapterData } from '@/data/chapterData';

// Predefined boards
const predefinedBoards = [
  { name: 'CBSE', code: 'cbse' },
  { name: 'ICSE', code: 'icse' },
  { name: 'State Board', code: 'state' },
  { name: 'IB', code: 'ib' },
  { name: 'IGCSE', code: 'igcse' },
];

// Subjects for each class (from learning/page.tsx)
const classSubjects: { [key: string]: Array<{ name: string; description: string; icon: string; color: string }> } = {
  '1': [
    { name: 'Mathematics', description: 'Basic numbers, shapes, and counting', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Nature, environment, and basic concepts', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Alphabet, words, and basic reading', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi alphabet and basic language', icon: 'fa-language', color: 'orange' }
  ],
  '2': [
    { name: 'Mathematics', description: 'Addition, subtraction, and basic operations', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Plants, animals, and natural phenomena', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Reading comprehension and grammar', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi reading and writing skills', icon: 'fa-language', color: 'orange' }
  ],
  '3': [
    { name: 'Mathematics', description: 'Multiplication, division, and fractions', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Human body, weather, and materials', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Advanced grammar and composition', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and poetry', icon: 'fa-language', color: 'orange' }
  ],
  '4': [
    { name: 'Mathematics', description: 'Decimals, geometry, and measurements', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Force, energy, and simple machines', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Creative writing and literature', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Advanced Hindi grammar and stories', icon: 'fa-language', color: 'orange' }
  ],
  '5': [
    { name: 'Mathematics', description: 'Algebra basics and advanced geometry', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Matter, energy, and chemical changes', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Advanced literature and critical thinking', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi poetry and advanced literature', icon: 'fa-language', color: 'orange' }
  ],
  '6': [
    { name: 'Mathematics', description: 'Algebra, geometry, and statistics', icon: 'fa-calculator', color: 'blue' },
    { name: 'Science', description: 'Physics, chemistry, and biology basics', icon: 'fa-flask', color: 'green' },
    { name: 'English', description: 'Literature analysis and writing skills', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi grammar and literature', icon: 'fa-language', color: 'orange' },
    { name: 'Social Studies', description: 'History, geography, and civics', icon: 'fa-globe', color: 'indigo' },
    { name: 'Computer Science', description: 'Basic programming and computer concepts', icon: 'fa-laptop', color: 'teal' }
  ],
  '7': [
    { name: 'Mathematics', description: 'Advanced algebra and geometry', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Motion, force, and energy', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Elements, compounds, and reactions', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Cell biology and life processes', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Advanced literature and composition', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and advanced grammar', icon: 'fa-language', color: 'orange' }
  ],
  '8': [
    { name: 'Mathematics', description: 'Trigonometry and advanced geometry', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Light, sound, and electricity', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Acids, bases, and chemical bonding', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Reproduction and genetics', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Literature and advanced writing', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi poetry and prose', icon: 'fa-language', color: 'orange' }
  ],
  '9': [
    { name: 'Mathematics', description: 'Coordinate geometry and statistics', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Mechanics and thermodynamics', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Atomic structure and periodic table', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Cell division and evolution', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Literature and critical analysis', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and grammar', icon: 'fa-language', color: 'orange' },
    { name: 'Social Studies', description: 'History and political science', icon: 'fa-globe', color: 'rose' },
    { name: 'Computer Science', description: 'Programming and algorithms', icon: 'fa-laptop', color: 'violet' }
  ],
  '10': [
    { name: 'Mathematics', description: 'Trigonometry and probability', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Optics and modern physics', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Organic and inorganic chemistry', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Ecology and biotechnology', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Literature and board preparation', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and board prep', icon: 'fa-language', color: 'orange' },
    { name: 'Social Studies', description: 'History and geography', icon: 'fa-globe', color: 'rose' },
    { name: 'Computer Science', description: 'Advanced programming', icon: 'fa-laptop', color: 'violet' }
  ],
  '11': [
    { name: 'Mathematics', description: 'Calculus and advanced algebra', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Mechanics and waves', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Physical and organic chemistry', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Botany and zoology', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Literature and communication', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and grammar', icon: 'fa-language', color: 'orange' },
    { name: 'Economics', description: 'Micro and macro economics', icon: 'fa-chart-line', color: 'amber' },
    { name: 'Accountancy', description: 'Financial accounting', icon: 'fa-calculator', color: 'green' },
    { name: 'Business Studies', description: 'Business management', icon: 'fa-briefcase', color: 'blue' },
    { name: 'Computer Science', description: 'Programming and databases', icon: 'fa-laptop', color: 'violet' }
  ],
  '12': [
    { name: 'Mathematics', description: 'Advanced calculus and statistics', icon: 'fa-calculator', color: 'blue' },
    { name: 'Physics', description: 'Modern physics and electronics', icon: 'fa-atom', color: 'indigo' },
    { name: 'Chemistry', description: 'Advanced organic chemistry', icon: 'fa-vial', color: 'teal' },
    { name: 'Biology', description: 'Advanced botany and zoology', icon: 'fa-dna', color: 'emerald' },
    { name: 'English', description: 'Literature and competitive prep', icon: 'fa-book', color: 'purple' },
    { name: 'Hindi', description: 'Hindi literature and competitive prep', icon: 'fa-language', color: 'orange' },
    { name: 'Economics', description: 'Advanced economics', icon: 'fa-chart-line', color: 'amber' },
    { name: 'Accountancy', description: 'Advanced accounting', icon: 'fa-calculator', color: 'green' },
    { name: 'Business Studies', description: 'Advanced business management', icon: 'fa-briefcase', color: 'blue' },
    { name: 'Computer Science', description: 'Advanced programming and AI', icon: 'fa-laptop', color: 'violet' }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const stats = {
      boards: 0,
      classes: 0,
      subjects: 0,
      chapters: 0,
      videos: 0,
      pdfs: 0,
    };

    // Create or get boards
    const boardMap = new Map<string, string>();
    for (const board of predefinedBoards) {
      // Try to find by code first
      let existing = await prisma.board.findUnique({
        where: { code: board.code },
      });

      // If not found by code, try by name (in case code was different)
      if (!existing) {
        existing = await prisma.board.findUnique({
          where: { name: board.name },
        });
      }

      if (existing) {
        boardMap.set(board.code, existing.id);
      } else {
        try {
          const created = await prisma.board.create({
            data: {
              name: board.name,
              code: board.code,
            },
          });
          boardMap.set(board.code, created.id);
          stats.boards++;
        } catch (error: any) {
          // If creation fails due to unique constraint, try to find again
          if (error.code === 'P2002') {
            existing = await prisma.board.findFirst({
              where: {
                OR: [
                  { code: board.code },
                  { name: board.name },
                ],
              },
            });
            if (existing) {
              boardMap.set(board.code, existing.id);
            } else {
              console.error(`Failed to create or find board: ${board.name} (${board.code})`);
            }
          } else {
            throw error;
          }
        }
      }
    }

    // Use CBSE as the default board for seeding
    const defaultBoardId = boardMap.get('cbse');
    if (!defaultBoardId) {
      throw new Error('CBSE board not found or could not be created');
    }

    // Create classes for each board
    const classMap = new Map<string, string>(); // key: "boardId-classNumber", value: classId
    for (const boardCode of predefinedBoards.map(b => b.code)) {
      const boardId = boardMap.get(boardCode)!;
      for (let i = 1; i <= 12; i++) {
        const classNumber = String(i);
        const key = `${boardId}-${classNumber}`;
        
        const existing = await prisma.class.findUnique({
          where: {
            boardId_number: {
              boardId,
              number: classNumber,
            },
          },
        });

        if (existing) {
          classMap.set(key, existing.id);
        } else {
          const created = await prisma.class.create({
            data: {
              boardId,
              number: classNumber,
              name: `Class ${i}`,
            },
          });
          classMap.set(key, created.id);
          stats.classes++;
        }
      }
    }

    // Create subjects and chapters
    const subjectMap = new Map<string, string>(); // key: "classId-subjectSlug", value: subjectId
    
    for (const [classNum, subjects] of Object.entries(classSubjects)) {
      // Get class ID for CBSE board (default)
      const classKey = `${defaultBoardId}-${classNum}`;
      const classId = classMap.get(classKey);
      
      if (!classId) continue;

      for (const subject of subjects) {
        const slug = subject.name.toLowerCase().replace(/\s+/g, '-');
        const subjectKey = `${classId}-${slug}`;

        // Check if subject exists
        let subjectId = subjectMap.get(subjectKey);
        
        if (!subjectId) {
          const existing = await prisma.subject.findUnique({
            where: {
              classId_slug: {
                classId,
                slug,
              },
            },
          });

          if (existing) {
            subjectId = existing.id;
          } else {
            const created = await prisma.subject.create({
              data: {
                classId,
                name: subject.name,
                slug,
                description: subject.description,
                icon: subject.icon,
                color: subject.color,
              },
            });
            subjectId = created.id;
            stats.subjects++;
          }
          subjectMap.set(subjectKey, subjectId);
        }

        // Get chapters for this subject and class
        const subjectKeyForChapters = subject.name.toLowerCase();
        const chapters = chapterData[subjectKeyForChapters]?.[classNum] || [];

        for (const chapter of chapters) {
          // Check if chapter exists
          let existingChapter = await prisma.chapter.findUnique({
            where: {
              subjectId_number: {
                subjectId,
                number: chapter.number,
              },
            },
            include: {
              videos: true,
              pdfs: true,
            },
          });

          let chapterId: string;
          if (existingChapter) {
            chapterId = existingChapter.id;
          } else {
            const created = await prisma.chapter.create({
              data: {
                subjectId,
                title: chapter.title,
                description: chapter.description,
                number: chapter.number,
                topics: chapter.topics.join(', '),
              },
            });
            chapterId = created.id;
            stats.chapters++;
            
            // Reload chapter with relations
            existingChapter = await prisma.chapter.findUnique({
              where: { id: chapterId },
              include: {
                videos: true,
                pdfs: true,
              },
            });
          }

          // Create videos
          for (let i = 0; i < chapter.videos.length; i++) {
            const video = chapter.videos[i];
            const existingVideo = existingChapter?.videos.find(v => v.title === video.title);
            
            if (!existingVideo) {
              await prisma.video.create({
                data: {
                  chapterId,
                  title: video.title,
                  url: video.url,
                  thumbnail: video.thumbnail,
                  duration: video.duration,
                  order: i,
                },
              });
              stats.videos++;
            }
          }

          // Create PDFs
          for (let i = 0; i < chapter.pdfs.length; i++) {
            const pdf = chapter.pdfs[i];
            const existingPdf = existingChapter?.pdfs.find(p => p.title === pdf.title);
            
            if (!existingPdf) {
              await prisma.pdf.create({
                data: {
                  chapterId,
                  title: pdf.title,
                  url: pdf.url,
                  size: pdf.size,
                  pages: pdf.pages,
                  order: i,
                },
              });
              stats.pdfs++;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      stats,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}

