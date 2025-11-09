"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { 
  Typography, 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Textarea,
  Select,
  Option,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Chip
} from '@material-tailwind/react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  VideoCameraIcon,
  DocumentIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Board {
  id: string;
  name: string;
  code: string;
}

interface Class {
  id: string;
  boardId: string;
  number: string;
  name?: string;
  board?: Board;
}

interface Subject {
  id: string;
  classId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  class?: Class;
}

interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  number: number;
  topics?: string;
  subject?: Subject;
  videos?: Video[];
  pdfs?: PDF[];
}

interface Video {
  id: string;
  chapterId: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  order: number;
}

interface PDF {
  id: string;
  chapterId: string;
  title: string;
  url: string;
  size?: string;
  pages?: number;
  order: number;
}

export default function AdminLearningPage() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Selection states - cascading dropdowns
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  // File upload states
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  // Selected chapter data
  const [selectedChapterData, setSelectedChapterData] = useState<Chapter | null>(null);

  // Form states for creating new subject/chapter
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newSubjectForm, setNewSubjectForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
  });
  const [newChapterForm, setNewChapterForm] = useState({
    title: '',
    description: '',
    number: 1,
    topics: '',
  });

  const [seeding, setSeeding] = useState(false);

  // Check admin access
  useEffect(() => {
    if (userLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (!data.isAdmin) {
          setError('Access denied. Admin privileges required.');
          return;
        }

        await loadData();
      } catch (err) {
        console.error('Admin check error:', err);
        setError('Failed to verify admin access.');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, isAuthenticated, userLoading, router]);

  // Predefined boards and classes (matching learning page structure)
  const predefinedBoards = [
    { id: 'cbse', name: 'CBSE', code: 'cbse' },
    { id: 'icse', name: 'ICSE', code: 'icse' },
    { id: 'state', name: 'State Board', code: 'state' },
    { id: 'ib', name: 'IB', code: 'ib' },
    { id: 'igcse', name: 'IGCSE', code: 'igcse' },
  ];

  const predefinedClasses = Array.from({ length: 12 }, (_, i) => ({
    id: `class-${i + 1}`,
    number: String(i + 1),
    name: `Class ${i + 1}`,
  }));

  const loadData = async () => {
    try {
      // Load boards from database, but fallback to predefined if empty
      const boardsRes = await fetch('/api/admin/learning/boards', {
        credentials: 'include',
      });
      if (boardsRes.ok) {
        const boardsData = await boardsRes.json();
        const dbBoards = boardsData.boards || [];
        // Merge predefined boards with database boards (avoid duplicates)
        const allBoards = [...predefinedBoards];
        dbBoards.forEach((dbBoard: Board) => {
          if (!allBoards.find(b => b.code === dbBoard.code)) {
            allBoards.push(dbBoard);
          }
        });
        setBoards(allBoards);
      } else {
        setBoards(predefinedBoards);
      }

      // Load classes from database, but use predefined as base
      const classesRes = await fetch('/api/admin/learning/classes', {
        credentials: 'include',
      });
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        const dbClasses = classesData.classes || [];
        // Use database classes if available, otherwise use predefined
        if (dbClasses.length > 0) {
          setClasses(dbClasses);
        } else {
          // Map predefined classes to database format
          setClasses(predefinedClasses.map(cls => ({
            id: cls.id,
            boardId: selectedBoard || '',
            number: cls.number,
            name: cls.name,
          })));
        }
      } else {
        setClasses(predefinedClasses.map(cls => ({
          id: cls.id,
          boardId: selectedBoard || '',
          number: cls.number,
          name: cls.name,
        })));
      }

      const [subjectsRes, chaptersRes] = await Promise.all([
        fetch('/api/admin/learning/subjects', { credentials: 'include' }),
        fetch('/api/admin/learning/chapters', { credentials: 'include' }),
      ]);

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData.subjects || []);
      }

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData.chapters || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      // Fallback to predefined data
      setBoards(predefinedBoards);
      setClasses(predefinedClasses.map(cls => ({
        id: cls.id,
        boardId: selectedBoard || '',
        number: cls.number,
        name: cls.name,
      })));
    }
  };

  // Load chapter data when selected
  useEffect(() => {
    if (selectedChapter) {
      const chapter = chapters.find(c => c.id === selectedChapter);
      if (chapter) {
        // Fetch full chapter data with videos and PDFs
        fetch(`/api/admin/learning/chapters?chapterId=${selectedChapter}`, {
          credentials: 'include',
        })
          .then(res => res.json())
          .then(data => {
            if (data.chapter) {
              setSelectedChapterData(data.chapter);
            }
          })
          .catch(err => console.error('Error loading chapter:', err));
      }
    } else {
      setSelectedChapterData(null);
    }
  }, [selectedChapter, chapters]);

  // Reset cascading dropdowns when parent changes
  useEffect(() => {
    if (!selectedBoard) {
      setSelectedClass('');
      setSelectedSubject('');
      setSelectedChapter('');
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (!selectedClass) {
      setSelectedSubject('');
      setSelectedChapter('');
    }
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedSubject) {
      setSelectedChapter('');
    }
  }, [selectedSubject]);

  // Delete video handler
  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/learning/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
        if (selectedChapter) {
          const res = await fetch(`/api/admin/learning/chapters?chapterId=${selectedChapter}`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (data.chapter) {
            setSelectedChapterData(data.chapter);
          }
        }
        alert('Video deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Failed to delete video');
    }
  };

  // Delete PDF handler
  const handleDeletePDF = async (pdfId: string) => {
    if (!confirm('Are you sure you want to delete this PDF?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/learning/pdfs/${pdfId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
        if (selectedChapter) {
          const res = await fetch(`/api/admin/learning/chapters?chapterId=${selectedChapter}`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (data.chapter) {
            setSelectedChapterData(data.chapter);
          }
        }
        alert('PDF deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete PDF');
      }
    } catch (err) {
      console.error('Error deleting PDF:', err);
      alert('Failed to delete PDF');
    }
  };

  // Handle create new subject
  const handleCreateSubject = async () => {
    if (!selectedBoard || !selectedClass || !newSubjectForm.name || !newSubjectForm.slug) {
      alert('Please select a board and class, and fill in subject name and slug');
      return;
    }

    try {
      // Ensure board and class exist first - this will create them if they don't exist
      const { board, class: classItem } = await ensureBoardAndClass(selectedBoard, selectedClass);

      if (!classItem || !classItem.id) {
        alert('Failed to find or create class. Please try again.');
        return;
      }

      const response = await fetch('/api/admin/learning/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          classId: classItem.id,
          name: newSubjectForm.name,
          slug: newSubjectForm.slug.toLowerCase(),
          description: newSubjectForm.description || undefined,
          icon: newSubjectForm.icon || undefined,
          color: newSubjectForm.color || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedSubject(data.subject.id);
        setNewSubjectForm({ name: '', slug: '', description: '', icon: '', color: '' });
        setShowSubjectForm(false);
        await loadData();
        alert('Subject created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create subject');
      }
    } catch (err) {
      console.error('Error creating subject:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Check if it's an authentication error
      if (errorMessage.includes('Authentication') || errorMessage.includes('Admin access')) {
        alert(`Authentication Error: ${errorMessage}\n\nPlease make sure:\n1. You are logged in\n2. Your email is in the admin list\n3. Your session is valid`);
      } else {
        alert(`Failed to create subject: ${errorMessage}`);
      }
    }
  };

  // Handle create new chapter
  const handleCreateChapter = async () => {
    if (!selectedSubject || !newChapterForm.title || !newChapterForm.number) {
      alert('Please select a subject and fill in chapter title and number');
      return;
    }

    try {
      const response = await fetch('/api/admin/learning/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subjectId: selectedSubject,
          title: newChapterForm.title,
          description: newChapterForm.description || undefined,
          number: parseInt(String(newChapterForm.number)),
          topics: newChapterForm.topics || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedChapter(data.chapter.id);
        setNewChapterForm({ title: '', description: '', number: 1, topics: '' });
        setShowChapterForm(false);
        await loadData();
        alert('Chapter created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create chapter');
      }
    } catch (err) {
      console.error('Error creating chapter:', err);
      alert('Failed to create chapter');
    }
  };

  // Ensure board and class exist in database
  const ensureBoardAndClass = async (boardCode: string, classNumber: string) => {
    try {
      // Normalize board code to lowercase (API stores it as lowercase)
      const normalizedBoardCode = boardCode.toLowerCase();
      
      // Always fetch fresh data from database to ensure we have the latest
      let boardsRes: Response;
      try {
        boardsRes = await fetch('/api/admin/learning/boards', {
          credentials: 'include', // Include cookies for authentication
        });
      } catch (fetchError) {
        console.error('Network error fetching boards:', fetchError);
        throw new Error('Network error: Could not connect to server. Please check your connection.');
      }
      
      if (!boardsRes.ok) {
        // Clone the response so we can read it multiple times
        const responseClone = boardsRes.clone();
        let errorMessage = 'Failed to fetch boards from database';
        let errorDetails = '';
        
        try {
          const errorData = await boardsRes.json();
          errorMessage = errorData.error || errorMessage;
          errorDetails = errorData.message || errorData.details || '';
        } catch (parseError) {
          // Response might not be JSON, try text
          try {
            const text = await responseClone.text();
            errorMessage = `Failed to fetch boards: ${boardsRes.status} ${boardsRes.statusText}`;
            errorDetails = text || '';
          } catch (textError) {
            errorMessage = `Failed to fetch boards: ${boardsRes.status} ${boardsRes.statusText}`;
          }
        }
        
        // Provide more specific error messages
        if (boardsRes.status === 403) {
          throw new Error('Admin access required. Please ensure you are logged in as an admin user.');
        } else if (boardsRes.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (boardsRes.status === 500) {
          const fullError = errorDetails 
            ? `${errorMessage}\n\nDetails: ${errorDetails}`
            : errorMessage;
          throw new Error(`Server error: ${fullError}`);
        } else {
          throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
        }
      }
      
      const boardsData = await boardsRes.json();
      const dbBoards: Board[] = boardsData.boards || [];
      
      // Find board in database by code
      let board = dbBoards.find((b: Board) => b.code.toLowerCase() === normalizedBoardCode);
      
      // If board doesn't exist, try to create it (only if it's a predefined board)
      if (!board) {
        const predefinedBoard = predefinedBoards.find(b => b.code.toLowerCase() === normalizedBoardCode);
        if (predefinedBoard) {
          try {
            const boardRes = await fetch('/api/admin/learning/boards', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include', // Include cookies for authentication
              body: JSON.stringify({
                name: predefinedBoard.name,
                code: normalizedBoardCode,
              }),
            });
            
            if (boardRes.ok) {
              const boardData = await boardRes.json();
              board = boardData.board;
            } else {
            // If creation failed (likely duplicate), fetch again
            const retryRes = await fetch('/api/admin/learning/boards', {
              credentials: 'include',
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              board = retryData.boards?.find((b: Board) => b.code.toLowerCase() === normalizedBoardCode);
            }
          }
        } catch (createError) {
          // If creation fails, try fetching one more time
          const retryRes = await fetch('/api/admin/learning/boards', {
            credentials: 'include',
          });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              board = retryData.boards?.find((b: Board) => b.code.toLowerCase() === normalizedBoardCode);
            }
          }
        }
      }

      if (!board || !board.id) {
        throw new Error(`Board "${boardCode}" not found in database. Please run "Seed Mock Data" first or create it manually.`);
      }

      // Fetch classes from database
      const classesRes = await fetch('/api/admin/learning/classes', {
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!classesRes.ok) {
        let errorMessage = 'Failed to fetch classes from database';
        try {
          const errorData = await classesRes.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Failed to fetch classes: ${classesRes.status} ${classesRes.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const classesData = await classesRes.json();
      const dbClasses: Class[] = classesData.classes || [];
      
      // Find class for this board
      let classItem = dbClasses.find((c: Class) => 
        c.number === classNumber && c.boardId === board.id
      );
      
      // If class doesn't exist, try to create it
      if (!classItem) {
        try {
          const classRes = await fetch('/api/admin/learning/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({
              boardId: board.id,
              number: classNumber,
              name: `Class ${classNumber}`,
            }),
          });
          
          if (classRes.ok) {
            const classData = await classRes.json();
            classItem = classData.class;
          } else {
            // If creation failed (likely duplicate), fetch again
            const retryRes = await fetch('/api/admin/learning/classes', {
              credentials: 'include',
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              classItem = retryData.classes?.find((c: Class) => 
                c.number === classNumber && c.boardId === board.id
              );
            }
          }
        } catch (createError) {
          // If creation fails, try fetching one more time
          const retryRes = await fetch('/api/admin/learning/classes', {
            credentials: 'include',
          });
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            classItem = retryData.classes?.find((c: Class) => 
              c.number === classNumber && c.boardId === board.id
            );
          }
        }
      }

      if (!classItem || !classItem.id) {
        throw new Error(`Class "${classNumber}" for board "${boardCode}" not found in database. Please run "Seed Mock Data" first or create it manually.`);
      }

      return { board, class: classItem };
    } catch (err) {
      console.error('Error ensuring board/class:', err);
      throw err;
    }
  };

  // Seed database with mock data
  const handleSeedDatabase = async () => {
    if (!confirm('This will populate the database with all mock data (boards, classes, subjects, chapters, videos, and PDFs). Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const response = await fetch('/api/admin/learning/seed', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Database seeded successfully!\n\nCreated:\n- ${data.stats.boards} Boards\n- ${data.stats.classes} Classes\n- ${data.stats.subjects} Subjects\n- ${data.stats.chapters} Chapters\n- ${data.stats.videos} Videos\n- ${data.stats.pdfs} PDFs`);
        await loadData();
      } else {
        const error = await response.json();
        alert(`Failed to seed database: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error seeding database:', err);
      alert('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  // Combined upload handler
  const handleUpload = async () => {
    if (!selectedBoard || !selectedClass || !selectedChapter) {
      alert('Please select Board, Class, Subject, and Chapter first');
      return;
    }

    if (!videoFile && !pdfFile) {
      alert('Please select at least one file (video or PDF) to upload');
      return;
    }

    if (videoFile && !videoTitle) {
      alert('Please enter a title for the video');
      return;
    }

    if (pdfFile && !pdfTitle) {
      alert('Please enter a title for the PDF');
      return;
    }

    setUploading(true);
    const errors: string[] = [];

    try {
      // Ensure board and class exist in database
      await ensureBoardAndClass(selectedBoard, selectedClass);

      // Upload video if provided
      if (videoFile && videoTitle) {
        try {
          const videoFormData = new FormData();
          videoFormData.append('video', videoFile);
          videoFormData.append('chapterId', selectedChapter);
          videoFormData.append('title', videoTitle);

          const videoResponse = await fetch('/api/admin/learning/videos', {
            method: 'POST',
            credentials: 'include',
            body: videoFormData,
          });

          if (!videoResponse.ok) {
            const error = await videoResponse.json();
            errors.push(`Video: ${error.error || 'Upload failed'}`);
          } else {
            setVideoFile(null);
            setVideoTitle('');
          }
        } catch (err) {
          errors.push('Video: Upload failed');
        }
      }

      // Upload PDF if provided
      if (pdfFile && pdfTitle) {
        try {
          const pdfFormData = new FormData();
          pdfFormData.append('pdf', pdfFile);
          pdfFormData.append('chapterId', selectedChapter);
          pdfFormData.append('title', pdfTitle);

          const pdfResponse = await fetch('/api/admin/learning/pdfs', {
            method: 'POST',
            credentials: 'include',
            body: pdfFormData,
          });

          if (!pdfResponse.ok) {
            const error = await pdfResponse.json();
            errors.push(`PDF: ${error.error || 'Upload failed'}`);
          } else {
            setPdfFile(null);
            setPdfTitle('');
          }
        } catch (err) {
          errors.push('PDF: Upload failed');
        }
      }

      // Reload data to show new uploads
      await loadData();
      
      // Reload selected chapter data
      if (selectedChapter) {
        const res = await fetch(`/api/admin/learning/chapters?chapterId=${selectedChapter}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.chapter) {
          setSelectedChapterData(data.chapter);
        }
      }

      if (errors.length > 0) {
        alert(`Some uploads failed:\n${errors.join('\n')}`);
      } else {
        alert('Files uploaded successfully!');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  // Get filtered data - match by class number and board code
  const filteredSubjects = subjects.filter(s => {
    const subjectClass = classes.find(c => c.id === s.classId);
    if (!subjectClass) return false;
    
    // Match by class number
    if (subjectClass.number !== selectedClass) return false;
    
    // Match by board (check board code or ID)
    const subjectBoard = boards.find(b => b.id === subjectClass.boardId);
    return subjectBoard && (subjectBoard.code === selectedBoard || subjectBoard.id === selectedBoard);
  });
  
  const filteredChapters = chapters.filter(c => {
    const chapterSubject = subjects.find(s => s.id === c.subjectId);
    if (!chapterSubject) return false;
    
    const subjectClass = classes.find(cls => cls.id === chapterSubject.classId);
    if (!subjectClass) return false;
    
    // Match by class number
    if (subjectClass.number !== selectedClass) return false;
    
    // Match by board
    const subjectBoard = boards.find(b => b.id === subjectClass.boardId);
    return subjectBoard && (subjectBoard.code === selectedBoard || subjectBoard.id === selectedBoard);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mt-20 min-h-[calc(100vh-80px)] text-center py-8">
          <Typography color="red">{error}</Typography>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="mt-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Button
                variant="text"
                onClick={() => router.push('/admin/dashboard')}
                className="mb-4 flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Typography variant="h2" color="blue-gray" className="mb-2">
                Learning Content Management
              </Typography>
              <Typography color="gray">
                Manage boards, classes, subjects, chapters, videos, and PDFs
              </Typography>
            </div>
          </div>

          {/* Single Upload Form */}
          <Card className="mb-8">
            <CardBody className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    Upload Videos & PDFs
                  </Typography>
                  <Typography color="gray">
                    Select Board → Class → Subject → Chapter, then upload your files
                  </Typography>
                </div>
                <Button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {seeding ? 'Seeding...' : 'Seed Mock Data'}
                </Button>
              </div>

              {/* Cascading Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Select
                  label="Select Board *"
                  value={selectedBoard}
                  onChange={(val) => setSelectedBoard(val || '')}
                >
                  {predefinedBoards.map((board) => (
                    <Option key={board.id} value={board.code}>
                      {board.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  label="Select Class *"
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val || '')}
                  disabled={!selectedBoard}
                >
                  {predefinedClasses.map((cls) => (
                    <Option key={cls.id} value={cls.number}>
                      {cls.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  label="Select Subject *"
                  value={selectedSubject}
                  onChange={(val) => {
                    if (val === 'add-new-subject') {
                      setShowSubjectForm(true);
                    } else {
                      setSelectedSubject(val || '');
                    }
                  }}
                  disabled={!selectedClass}
                >
                  {filteredSubjects.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Option>
                  ))}
                  <Option value="add-new-subject" className="font-semibold text-blue-600">
                    + Add New Subject
                  </Option>
                </Select>

                <Select
                  label="Select Chapter *"
                  value={selectedChapter}
                  onChange={(val) => {
                    if (val === 'add-new-chapter') {
                      setShowChapterForm(true);
                    } else {
                      setSelectedChapter(val || '');
                    }
                  }}
                  disabled={!selectedSubject}
                >
                  {filteredChapters.map((chapter) => (
                    <Option key={chapter.id} value={chapter.id}>
                      Chapter {chapter.number}: {chapter.title}
                    </Option>
                  ))}
                  <Option value="add-new-chapter" className="font-semibold text-blue-600">
                    + Add New Chapter
                  </Option>
                </Select>
              </div>

              {/* Add New Subject Form Modal */}
              {showSubjectForm && (
                <Card className="mb-6 border-2 border-blue-500">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h5">Create New Subject</Typography>
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => {
                          setShowSubjectForm(false);
                          setNewSubjectForm({ name: '', slug: '', description: '', icon: '', color: '' });
                        }}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Subject Name *"
                        value={newSubjectForm.name}
                        onChange={(e) => setNewSubjectForm({ ...newSubjectForm, name: e.target.value })}
                        placeholder="e.g., Mathematics"
                      />
                      <Input
                        label="Subject Slug *"
                        value={newSubjectForm.slug}
                        onChange={(e) => setNewSubjectForm({ ...newSubjectForm, slug: e.target.value })}
                        placeholder="e.g., mathematics"
                      />
                      <Input
                        label="Icon (FontAwesome)"
                        value={newSubjectForm.icon}
                        onChange={(e) => setNewSubjectForm({ ...newSubjectForm, icon: e.target.value })}
                        placeholder="e.g., fa-calculator"
                      />
                      <Input
                        label="Color"
                        value={newSubjectForm.color}
                        onChange={(e) => setNewSubjectForm({ ...newSubjectForm, color: e.target.value })}
                        placeholder="e.g., blue, green"
                      />
                    </div>
                    <Textarea
                      label="Description"
                      value={newSubjectForm.description}
                      onChange={(e) => setNewSubjectForm({ ...newSubjectForm, description: e.target.value })}
                      className="mb-4"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreateSubject} disabled={!selectedClass}>
                        Create Subject
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowSubjectForm(false);
                          setNewSubjectForm({ name: '', slug: '', description: '', icon: '', color: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Add New Chapter Form Modal */}
              {showChapterForm && (
                <Card className="mb-6 border-2 border-blue-500">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h5">Create New Chapter</Typography>
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => {
                          setShowChapterForm(false);
                          setNewChapterForm({ title: '', description: '', number: 1, topics: '' });
                        }}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Chapter Number *"
                        type="number"
                        value={newChapterForm.number}
                        onChange={(e) => setNewChapterForm({ ...newChapterForm, number: parseInt(e.target.value) || 1 })}
                      />
                      <Input
                        label="Chapter Title *"
                        value={newChapterForm.title}
                        onChange={(e) => setNewChapterForm({ ...newChapterForm, title: e.target.value })}
                        className="md:col-span-2"
                      />
                    </div>
                    <Textarea
                      label="Description"
                      value={newChapterForm.description}
                      onChange={(e) => setNewChapterForm({ ...newChapterForm, description: e.target.value })}
                      className="mb-4"
                    />
                    <Input
                      label="Topics (comma-separated)"
                      value={newChapterForm.topics}
                      onChange={(e) => setNewChapterForm({ ...newChapterForm, topics: e.target.value })}
                      className="mb-4"
                      placeholder="e.g., Addition, Subtraction, Multiplication"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreateChapter} disabled={!selectedSubject}>
                        Create Chapter
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowChapterForm(false);
                          setNewChapterForm({ title: '', description: '', number: 1, topics: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Selected Chapter Info */}
              {selectedChapterData && (
                <Card className="mb-6 bg-blue-50">
                  <CardBody>
                    <Typography variant="h6" className="mb-2">
                      {selectedChapterData.title}
                    </Typography>
                    {selectedChapterData.subject && (
                      <Typography color="gray" className="text-sm mb-2">
                        {selectedChapterData.subject.name} - 
                        {selectedChapterData.subject.class?.name || `Class ${selectedChapterData.subject.class?.number}`} - 
                        {selectedChapterData.subject.class?.board?.name}
                      </Typography>
                    )}
                    {selectedChapterData.description && (
                      <Typography color="gray" className="text-sm">
                        {selectedChapterData.description}
                      </Typography>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* File Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Video Upload */}
                <Card className="border-2 border-dashed border-gray-300">
                  <CardBody>
                    <div className="flex items-center gap-3 mb-4">
                      <VideoCameraIcon className="w-6 h-6 text-gray-700" />
                      <Typography variant="h6">Upload Video</Typography>
                    </div>
                    <Input
                      label="Video Title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="mb-4"
                      placeholder="Enter video title"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video File
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                      />
                      {videoFile && (
                        <Typography color="gray" className="text-sm mt-2">
                          Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </Typography>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* PDF Upload */}
                <Card className="border-2 border-dashed border-gray-300">
                  <CardBody>
                    <div className="flex items-center gap-3 mb-4">
                      <DocumentIcon className="w-6 h-6 text-gray-700" />
                      <Typography variant="h6">Upload PDF</Typography>
                    </div>
                    <Input
                      label="PDF Title"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      className="mb-4"
                      placeholder="Enter PDF title"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PDF File
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                      />
                      {pdfFile && (
                        <Typography color="gray" className="text-sm mt-2">
                          Selected: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </Typography>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedChapter || (!videoFile && !pdfFile) || uploading}
                className="w-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center gap-2 py-3"
                size="lg"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    Upload Files
                  </>
                )}
              </Button>
            </CardBody>
          </Card>

          {/* Existing Content Display */}
          {selectedChapterData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Videos */}
              <Card>
                <CardBody>
                  <Typography variant="h6" className="mb-4 flex items-center gap-2">
                    <VideoCameraIcon className="w-5 h-5" />
                    Existing Videos ({selectedChapterData.videos?.length || 0})
                  </Typography>
                  {selectedChapterData.videos && selectedChapterData.videos.length > 0 ? (
                    <div className="space-y-3">
                      {selectedChapterData.videos.map((video) => (
                        <div key={video.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between group hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <Typography variant="small" className="font-semibold">
                              {video.title}
                            </Typography>
                            <Typography color="gray" className="text-xs">
                              Duration: {video.duration || 'N/A'}
                            </Typography>
                          </div>
                          <Button
                            size="sm"
                            color="red"
                            variant="text"
                            onClick={() => handleDeleteVideo(video.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography color="gray" className="text-sm">
                      No videos uploaded yet
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Existing PDFs */}
              <Card>
                <CardBody>
                  <Typography variant="h6" className="mb-4 flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5" />
                    Existing PDFs ({selectedChapterData.pdfs?.length || 0})
                  </Typography>
                  {selectedChapterData.pdfs && selectedChapterData.pdfs.length > 0 ? (
                    <div className="space-y-3">
                      {selectedChapterData.pdfs.map((pdf) => (
                        <div key={pdf.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between group hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <Typography variant="small" className="font-semibold">
                              {pdf.title}
                            </Typography>
                            <Typography color="gray" className="text-xs">
                              Size: {pdf.size || 'N/A'}
                              {pdf.pages && ` • Pages: ${pdf.pages}`}
                            </Typography>
                          </div>
                          <Button
                            size="sm"
                            color="red"
                            variant="text"
                            onClick={() => handleDeletePDF(pdf.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography color="gray" className="text-sm">
                      No PDFs uploaded yet
                    </Typography>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
