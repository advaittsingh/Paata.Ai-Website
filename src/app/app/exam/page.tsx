"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Button, Card, CardBody, Input, Radio, IconButton, Chip } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { ScientificRenderer } from '@/components';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AppSidebar from '@/components/app-sidebar';

interface ExamQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: number | string; // For MCQ: index (0-3), for short answer: final answer text
  finalAnswer?: string; // The actual final answer text (for display)
  explanation: string;
  marks?: number;
  type?: 'mcq' | 'short_answer';
  keyPoints?: string[];
}

interface ExamSession {
  id: string;
  title: string;
  questions: ExamQuestion[];
  userAnswers: (number | string)[];
  score?: number;
  status: string;
  completedAt?: string | Date;
  metadata?: any;
}

export default function ExamPage() {
  const { user } = useUser();
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | string)[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewResults, setViewResults] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [showPaperUpload, setShowPaperUpload] = useState(false);
  const [isProcessingPaper, setIsProcessingPaper] = useState(false);
  const [paperSolutions, setPaperSolutions] = useState<any[] | null>(null);
  const [paperMetadata, setPaperMetadata] = useState<{subject: string; year: string; board: string} | null>(null);
  const [selectedPaperFiles, setSelectedPaperFiles] = useState<File[]>([]);
  const [paperPreviews, setPaperPreviews] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchExamSessions();
    }
  }, [user?.id]);

  const fetchExamSessions = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/exam?userId=${user.id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.error('Failed to fetch exam sessions:', response.status);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        // Parse questions and userAnswers from JSON strings
        const parsedSessions = (data.sessions || []).map((session: any) => {
          let questions = typeof session.questions === 'string' 
            ? JSON.parse(session.questions) 
            : session.questions || [];
          
          // Ensure all questions have required fields (type, finalAnswer, etc.)
          questions = questions.map((q: any) => {
            // First infer type
            const inferredType = q.type || (q.options && q.options.length > 0 ? 'mcq' : 'short_answer');
            
            // Then infer finalAnswer based on inferred type
            let finalAnswer = q.finalAnswer;
            if (!finalAnswer) {
              if (inferredType === 'mcq' && typeof q.correctAnswer === 'number' && q.options && q.options[q.correctAnswer]) {
                finalAnswer = q.options[q.correctAnswer];
              } else if (typeof q.correctAnswer === 'string') {
                finalAnswer = q.correctAnswer;
              } else if (q.correctAnswer !== null && q.correctAnswer !== undefined) {
                finalAnswer = String(q.correctAnswer);
              } else {
                finalAnswer = 'No answer provided';
              }
            }
            
            return {
              ...q,
              type: inferredType,
              finalAnswer: finalAnswer,
              marks: q.marks || 1,
              keyPoints: q.keyPoints || []
            };
          });
          
          return {
            ...session,
            questions,
            userAnswers: session.userAnswers 
              ? (typeof session.userAnswers === 'string' 
                  ? JSON.parse(session.userAnswers) 
                  : session.userAnswers)
              : [],
          };
        });
        setExamSessions(parsedSessions);
      }
    } catch (error) {
      console.error('Error fetching exam sessions:', error);
    }
  };

  const handleViewPreviousExam = (session: ExamSession) => {
    // Parse questions and userAnswers if they're strings
    let questions = typeof session.questions === 'string' 
      ? JSON.parse(session.questions) 
      : session.questions || [];
    
    // Ensure all questions have required fields
    questions = questions.map((q: any) => {
      // First infer type
      const inferredType = q.type || (q.options && q.options.length > 0 ? 'mcq' : 'short_answer');
      
      // Then infer finalAnswer based on inferred type
      let finalAnswer = q.finalAnswer;
      if (!finalAnswer) {
        if (inferredType === 'mcq' && typeof q.correctAnswer === 'number' && q.options && q.options[q.correctAnswer]) {
          finalAnswer = q.options[q.correctAnswer];
        } else if (typeof q.correctAnswer === 'string') {
          finalAnswer = q.correctAnswer;
        } else if (q.correctAnswer !== null && q.correctAnswer !== undefined) {
          finalAnswer = String(q.correctAnswer);
        } else {
          finalAnswer = 'No answer provided';
        }
      }
      
      return {
        ...q,
        type: inferredType,
        finalAnswer: finalAnswer,
        marks: q.marks || 1,
        keyPoints: q.keyPoints || []
      };
    });
    
    const userAnswers = session.userAnswers && (session.userAnswers.length > 0 || Array.isArray(session.userAnswers))
      ? (typeof session.userAnswers === 'string' 
          ? JSON.parse(session.userAnswers) 
          : session.userAnswers)
      : [];

    setExamSession({
      ...session,
      questions,
      userAnswers,
    });
    setSelectedAnswers(userAnswers?.length > 0 ? userAnswers : new Array(questions.length || 0).fill(''));
    setExamCompleted(true);
    setExamStarted(false);
    setViewResults(true); // Skip summary screen and go directly to detailed results
    setReviewQuestionIndex(0);
    // Extract timeSpent from metadata if available
    if (session.metadata) {
      try {
        const metadata = typeof session.metadata === 'string' 
          ? JSON.parse(session.metadata) 
          : session.metadata;
        if (metadata && metadata.timeSpent) {
          setTimeSpent(metadata.timeSpent);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  };

  useEffect(() => {
    if (examStarted && !examCompleted) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, examCompleted]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [examConfig, setExamConfig] = useState({
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'medium',
    count: 5,
    questionTypes: {
      mcq: { enabled: true, count: 0 },
      twoMarker: { enabled: false, count: 0 },
      fiveMarker: { enabled: false, count: 0 },
      tenMarker: { enabled: false, count: 0 }
    }
  });

  const handleSolvePaper = async () => {
    if (!user) {
      alert('Please log in to solve papers');
      return;
    }

    if (!selectedPaperFiles || selectedPaperFiles.length === 0 || !paperMetadata?.subject) {
      alert('Please select at least one paper file/image and enter the subject');
      return;
    }

    setIsProcessingPaper(true);
    setPaperSolutions(null);

    // Calculate total file size
    const totalSize = selectedPaperFiles.reduce((sum, file) => sum + file.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    try {
      // Log file details before upload
      console.log('📤 Uploading files:', {
        count: selectedPaperFiles.length,
        files: selectedPaperFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        totalSizeMB: totalSizeMB + ' MB'
      });
      
      // Check total file size on frontend (should match backend limit)
      const maxSize = 100 * 1024 * 1024; // 100MB per file, but we'll check total
      const maxTotalSize = 200 * 1024 * 1024; // 200MB total for multiple files
      if (totalSize > maxTotalSize) {
        alert(`Total file size is too large (${totalSizeMB} MB). Maximum total size is 200MB. Please try with fewer or smaller files.`);
        setIsProcessingPaper(false);
        return;
      }
      
      // Check individual file sizes
      for (const file of selectedPaperFiles) {
        if (file.size > maxSize) {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          alert(`File "${file.name}" is too large (${fileSizeMB} MB). Maximum size per file is 100MB.`);
          setIsProcessingPaper(false);
          return;
        }
      }
      
      const formData = new FormData();
      // Append all files - backend will handle multiple files
      selectedPaperFiles.forEach((file, index) => {
        formData.append('papers', file); // Use 'papers' (plural) for multiple files
      });
      formData.append('subject', paperMetadata.subject);
      if (paperMetadata.year) formData.append('year', paperMetadata.year);
      if (paperMetadata.board) formData.append('board', paperMetadata.board);

      let response: Response;
      try {
        console.log('📤 Sending request to /api/exam/solve-paper...');
        response = await fetch('/api/exam/solve-paper', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        console.log('📥 Received response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (fetchError: any) {
        console.error('❌ Fetch error (network/connection issue):', {
          message: fetchError.message,
          name: fetchError.name,
          stack: fetchError.stack?.substring(0, 300)
        });
        throw new Error(`Network error: ${fetchError.message || 'Failed to connect to server'}`);
      }

      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Raw response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        textLength: responseText.length,
        textPreview: responseText.substring(0, 200)
      });

      // Safe JSON parsing with fallback
      let data: any = {};
      try {
        data = responseText && responseText.trim().length > 0 ? JSON.parse(responseText) : {};
      } catch (parseError: any) {
        console.warn('⚠️ Server returned non-JSON response:', {
          text: responseText.substring(0, 200),
          error: parseError.message
        });
        // Create a structured error object from non-JSON response
        data = { 
          error: responseText || `Server error: ${response.status}`,
          message: responseText || `Server error: ${response.status}`,
          rawResponse: responseText.substring(0, 500)
        };
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `Error ${response.status}: ${response.statusText}`;
        const errorDetails = data.details;
        
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          details: errorDetails,
          errorData: data,
          hasError: !!data.error,
          hasMessage: !!data.message,
          success: data.success
        });
        
        throw new Error(errorMessage);
      }

      // Validate successful response
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Empty response from server');
      }

      if (data.success && data.solutions) {
        setPaperSolutions(data.solutions);
        // Keep metadata as is - no need to update
      } else {
        throw new Error(data.error || data.message || 'Failed to solve paper');
      }
    } catch (error: any) {
      console.error('❌ Error solving paper:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 500)
      });
      
      const errorMessage = error.message || 'Failed to solve paper. Please try again.';
      
      // Show more specific error messages
      if (errorMessage.includes('OpenAI API key')) {
        alert('OpenAI API key is not configured. Please contact support.');
      } else if (errorMessage.includes('Authentication')) {
        alert('Please log in to solve papers.');
      } else if (errorMessage.includes('scanned document') || errorMessage.includes('image-based')) {
        alert('This PDF looks like a scanned paper (image-based). The system will try to extract text using OCR. If that fails, please upload clear images (JPEG/PNG) instead.');
      } else if (errorMessage.includes('Failed to extract text from PDF') || errorMessage.includes('OCR')) {
        alert('Failed to extract text from the PDF. The images may be too blurry. Please try uploading a clearer version or convert the PDF pages to images (JPEG/PNG) and upload those instead.');
      } else if (errorMessage.includes('password-protected') || errorMessage.includes('encrypted')) {
        alert('The PDF is password-protected. Please remove the password and try again.');
      } else if (errorMessage.includes('Invalid PDF') || errorMessage.includes('Invalid PDF file format')) {
        alert('The PDF could not be parsed. Try opening and re-saving it using Adobe Acrobat or another PDF editor, or upload a clearer version.');
      } else if (errorMessage.includes('corrupted')) {
        alert('The PDF seems corrupted. Try downloading a fresh copy or re-exporting the file.');
      } else if (errorMessage.includes('too large') || errorMessage.includes('size limit exceeded') || errorMessage.includes('413') || errorMessage.includes('Payload Too Large')) {
        // Show the actual error message which includes size details
        const sizeLimitMessage = errorMessage.includes('Request size') || errorMessage.includes('1MB') || errorMessage.includes('4.5MB')
          ? errorMessage
          : `File upload failed due to size limit. Next.js has a default body size limit:\n- Local development: ~1MB\n- Production (Vercel): ~4.5MB\n\nYour files exceed this limit.\n\nSolutions:\n1. Use files smaller than 1MB for local dev\n2. Deploy to Vercel (4.5MB limit)\n3. Split the PDFs into smaller parts\n4. Compress the files before uploading`;
        alert(sizeLimitMessage);
      } else if (errorMessage.includes('File too small')) {
        alert('The uploaded file is too small to be a valid PDF. Please check the file and try again.');
      } else if (errorMessage.includes('Network error') || errorMessage.includes('Failed to connect')) {
        alert(`Network error: ${errorMessage}\n\nPlease check your internet connection and try again.`);
      } else {
        // Show full error message for debugging
        alert(`Error: ${errorMessage}\n\nPlease check the browser console for more details.`);
      }
    } finally {
      setIsProcessingPaper(false);
    }
  };

  const handleCreateExam = async () => {
    if (!user) {
      alert('Please log in to generate exams');
      return;
    }

    if (!examConfig.subject || !examConfig.topic) {
      alert('Please fill in both Subject and Topic fields');
      return;
    }

    // Validate that at least one question type is enabled and has count > 0
    const totalQuestions = 
      (examConfig.questionTypes.mcq.enabled ? examConfig.questionTypes.mcq.count : 0) +
      (examConfig.questionTypes.twoMarker.enabled ? examConfig.questionTypes.twoMarker.count : 0) +
      (examConfig.questionTypes.fiveMarker.enabled ? examConfig.questionTypes.fiveMarker.count : 0) +
      (examConfig.questionTypes.tenMarker.enabled ? examConfig.questionTypes.tenMarker.count : 0);

    if (totalQuestions === 0) {
      alert('Please select at least one question type and specify the number of questions');
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare question type configuration
      const questionTypesConfig: any = {};
      if (examConfig.questionTypes.mcq.enabled && examConfig.questionTypes.mcq.count > 0) {
        questionTypesConfig.mcq = { count: examConfig.questionTypes.mcq.count, marks: 1 };
      }
      if (examConfig.questionTypes.twoMarker.enabled && examConfig.questionTypes.twoMarker.count > 0) {
        questionTypesConfig.twoMarker = { count: examConfig.questionTypes.twoMarker.count, marks: 2 };
      }
      if (examConfig.questionTypes.fiveMarker.enabled && examConfig.questionTypes.fiveMarker.count > 0) {
        questionTypesConfig.fiveMarker = { count: examConfig.questionTypes.fiveMarker.count, marks: 5 };
      }
      if (examConfig.questionTypes.tenMarker.enabled && examConfig.questionTypes.tenMarker.count > 0) {
        questionTypesConfig.tenMarker = { count: examConfig.questionTypes.tenMarker.count, marks: 10 };
      }

      // Generate questions using AI
      const generateResponse = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: examConfig.subject.trim(),
          topic: examConfig.topic.trim(),
          difficulty: examConfig.difficulty,
          questionTypes: questionTypesConfig
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({ error: 'Failed to generate exam' }));
        throw new Error(errorData.error || `Server error: ${generateResponse.status}`);
      }

      const generateData = await generateResponse.json();
      
      if (!generateData.success || !generateData.questions || !Array.isArray(generateData.questions)) {
        throw new Error(generateData.error || 'Failed to generate questions - invalid response');
      }

      if (generateData.questions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      const generatedQuestions: ExamQuestion[] = generateData.questions.map((q: any, idx: number) => ({
        id: q.id || `q_${idx + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        finalAnswer: q.finalAnswer, // Include finalAnswer
        explanation: q.explanation,
        marks: q.marks,
        type: q.type, // Include type (mcq or short_answer)
        keyPoints: q.keyPoints // Include keyPoints for short answer questions
      }));

      // Create exam session with generated questions
      const response = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: `${examConfig.subject} - ${examConfig.topic}`,
          questions: generatedQuestions,
          totalQuestions: generatedQuestions.length,
          userId: user.id,
          status: 'not_started'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create exam session' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.session) {
        // Parse questions from JSON string
        let sessionQuestions = typeof data.session.questions === 'string' 
          ? JSON.parse(data.session.questions) 
          : data.session.questions || generatedQuestions;
        
        // Ensure all questions have required fields (type, finalAnswer, etc.)
        sessionQuestions = Array.isArray(sessionQuestions) ? sessionQuestions.map((q: any) => {
          // First infer type
          const inferredType = q.type || (q.options && q.options.length > 0 ? 'mcq' : 'short_answer');
          
          // Then infer finalAnswer based on inferred type
          let finalAnswer = q.finalAnswer;
          if (!finalAnswer) {
            if (inferredType === 'mcq' && typeof q.correctAnswer === 'number' && q.options && q.options[q.correctAnswer]) {
              finalAnswer = q.options[q.correctAnswer];
            } else if (typeof q.correctAnswer === 'string') {
              finalAnswer = q.correctAnswer;
            } else if (q.correctAnswer !== null && q.correctAnswer !== undefined) {
              finalAnswer = String(q.correctAnswer);
            } else {
              finalAnswer = 'No answer provided';
            }
          }
          
          return {
            ...q,
            type: inferredType,
            finalAnswer: finalAnswer,
            marks: q.marks || 1,
            keyPoints: q.keyPoints || []
          };
        }) : generatedQuestions;
        
        setExamSession({
          id: data.session.id,
          title: data.session.title || `${examConfig.subject} - ${examConfig.topic}`,
          questions: sessionQuestions,
          userAnswers: [],
          status: data.session.status || 'not_started'
        });
        setExamStarted(false);
        setExamCompleted(false);
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setTimeSpent(0);
        // Skip fetchExamSessions() - we already have the session data
      } else {
        throw new Error(data.error || 'Failed to create exam session');
      }
    } catch (error: any) {
      console.error('Error creating exam:', error);
      const errorMessage = error.message || 'Failed to generate exam. Please try again.';
      
      // Provide more helpful error messages
      if (errorMessage.includes('OpenAI API key')) {
        alert('OpenAI API key is not configured. Please contact support or check your environment variables.');
      } else if (errorMessage.includes('Authentication')) {
        alert('Please log in to generate exams.');
      } else if (errorMessage.includes('parse')) {
        alert('Error processing generated questions. Please try again with different parameters.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setSelectedAnswers(new Array(examSession?.questions.length || 0).fill(''));
    setCurrentQuestion(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleTextAnswerChange = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (examSession && currentQuestion < examSession.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examSession) return;

    let totalMarks = 0;
    let earnedMarks = 0;
    
    examSession.questions.forEach((q, idx) => {
      const questionMarks = q.marks || 1;
      totalMarks += questionMarks;
      
      // For MCQ, check exact match
      if (q.type === 'mcq' && selectedAnswers[idx] === q.correctAnswer) {
        earnedMarks += questionMarks;
      }
      // For short answer, we'll need AI evaluation or manual review
      // For now, we'll mark it as 0 and let the user see the correct answer
      else if (q.type === 'short_answer') {
        // Short answer questions need manual/AI evaluation
        // For now, we'll show the correct answer in review
      }
    });

    const totalQuestions = examSession.questions.length || 1;
    const percentageScore = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;

    try {
      const response = await fetch('/api/exam', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: examSession.id,
          userAnswers: selectedAnswers,
          score: percentageScore,
          timeSpent: timeSpent,
          status: 'completed'
        })
      });

      const data = await response.json();
      if (data.success) {
        setExamCompleted(true);
        setExamSession({ 
          ...examSession, 
          score: percentageScore, 
          userAnswers: selectedAnswers,
          status: 'completed',
          completedAt: new Date().toISOString(),
          metadata: { timeSpent }
        });
        fetchExamSessions(); // Refresh history
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const currentQ = examSession?.questions[currentQuestion];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton variant="text" color="gray" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <Typography variant="h5" color="blue-gray" className="font-bold">Exam Mode</Typography>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
          
          {!examSession ? (
            <>
              {/* Exam History */}
              {examSessions.length > 0 && (
                <Card className="mb-6">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6">Previous Exam Sessions</Typography>
                      <Button variant="text" onClick={() => setShowHistory(!showHistory)}>
                        {showHistory ? 'Hide' : 'Show'} History
                      </Button>
                    </div>
                    {showHistory && (
                      <div className="space-y-3">
                        {examSessions.map((session) => (
                          <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-900 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Typography variant="h6" className="mb-1">{session.title}</Typography>
                                <Typography variant="small" color="gray" className="mb-2">
                                  Status: <span className={`font-semibold ${
                                    session.status === 'completed' ? 'text-green-600' : 
                                    session.status === 'in_progress' ? 'text-blue-600' : 
                                    'text-gray-600'
                                  }`}>
                                    {session.status === 'completed' ? 'Completed' : 
                                     session.status === 'in_progress' ? 'In Progress' : 
                                     'Not Started'}
                                  </span>
                                  {session.score !== undefined && session.score !== null && (
                                    <span className={`ml-2 font-semibold ${
                                      session.score >= 70 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      | Score: {typeof session.score === 'number' ? session.score.toFixed(1) : session.score}%
                                    </span>
                                  )}
                                </Typography>
                                {session.completedAt && (
                                  <Typography variant="small" color="gray">
                                    Completed: {new Date(session.completedAt).toLocaleDateString()} at {new Date(session.completedAt).toLocaleTimeString()}
                                  </Typography>
                                )}
                              </div>
                              {session.status === 'completed' && (
                                <Button
                                  onClick={() => handleViewPreviousExam(session)}
                                  className="bg-gray-900 ml-4"
                                  size="sm"
                                >
                                  View Results
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}
              
              {/* Tabs for Generate vs Upload */}
              <div className="mb-6 flex gap-2 justify-center">
                <Button
                  variant={!showPaperUpload ? 'filled' : 'outlined'}
                  onClick={() => {
                    setShowPaperUpload(false);
                    setPaperSolutions(null);
                    setSelectedPaperFiles([]);
                    setPaperPreviews(new Map());
                  }}
                  className={!showPaperUpload ? 'bg-gray-900' : ''}
                >
                  Generate Exam
                </Button>
                <Button
                  variant={showPaperUpload ? 'filled' : 'outlined'}
                  onClick={() => {
                    setShowPaperUpload(true);
                    setExamSession(null);
                    setExamCompleted(false);
                    setViewResults(false);
                  }}
                  className={showPaperUpload ? 'bg-gray-900' : ''}
                >
                  Upload Previous Year Paper
                </Button>
              </div>

              {!showPaperUpload ? (
              <Card>
                <CardBody className="py-8">
                  <Typography variant="h6" className="mb-6 text-center">
                    Generate AI-Powered Exam
                  </Typography>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <div>
                      <Typography variant="small" className="mb-2">Subject</Typography>
                      <Input
                        value={examConfig.subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({ ...examConfig, subject: e.target.value })}
                        placeholder="e.g., Mathematics, Physics, Chemistry"
                        className="!border-gray-300"
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="mb-2">Topic</Typography>
                      <Input
                        value={examConfig.topic}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({ ...examConfig, topic: e.target.value })}
                        placeholder="e.g., Calculus, Algebra, Mechanics"
                        className="!border-gray-300"
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="mb-2">Difficulty</Typography>
                      <div className="flex gap-2">
                        <Button
                          variant={examConfig.difficulty === 'easy' ? 'filled' : 'outlined'}
                          onClick={() => setExamConfig({ ...examConfig, difficulty: 'easy' })}
                          size="sm"
                          className={examConfig.difficulty === 'easy' ? 'bg-gray-900' : ''}
                        >
                          Easy
                        </Button>
                        <Button
                          variant={examConfig.difficulty === 'medium' ? 'filled' : 'outlined'}
                          onClick={() => setExamConfig({ ...examConfig, difficulty: 'medium' })}
                          size="sm"
                          className={examConfig.difficulty === 'medium' ? 'bg-gray-900' : ''}
                        >
                          Medium
                        </Button>
                        <Button
                          variant={examConfig.difficulty === 'hard' ? 'filled' : 'outlined'}
                          onClick={() => setExamConfig({ ...examConfig, difficulty: 'hard' })}
                          size="sm"
                          className={examConfig.difficulty === 'hard' ? 'bg-gray-900' : ''}
                        >
                          Hard
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Typography variant="small" className="mb-3 font-semibold">Question Types & Marks</Typography>
                      
                      {/* MCQ Questions */}
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examConfig.questionTypes.mcq.enabled}
                              onChange={(e) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  mcq: { ...examConfig.questionTypes.mcq, enabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-gray-900"
                            />
                            <Typography variant="small" className="font-semibold">MCQ Questions</Typography>
                          </div>
                          {examConfig.questionTypes.mcq.enabled && (
                            <Input
                              type="number"
                              value={examConfig.questionTypes.mcq.count}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  mcq: { ...examConfig.questionTypes.mcq, count: parseInt(e.target.value) || 0 }
                                }
                              })}
                              min="0"
                              max="20"
                              className="!border-gray-300 w-20"
                              placeholder="Count"
                            />
                          )}
                        </div>
                      </div>

                      {/* 2 Marker Questions */}
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examConfig.questionTypes.twoMarker.enabled}
                              onChange={(e) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  twoMarker: { ...examConfig.questionTypes.twoMarker, enabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-gray-900"
                            />
                            <Typography variant="small" className="font-semibold">2 Marker Questions</Typography>
                          </div>
                          {examConfig.questionTypes.twoMarker.enabled && (
                            <Input
                              type="number"
                              value={examConfig.questionTypes.twoMarker.count}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  twoMarker: { ...examConfig.questionTypes.twoMarker, count: parseInt(e.target.value) || 0 }
                                }
                              })}
                              min="0"
                              max="20"
                              className="!border-gray-300 w-20"
                              placeholder="Count"
                            />
                          )}
                        </div>
                      </div>

                      {/* 5 Marker Questions */}
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examConfig.questionTypes.fiveMarker.enabled}
                              onChange={(e) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  fiveMarker: { ...examConfig.questionTypes.fiveMarker, enabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-gray-900"
                            />
                            <Typography variant="small" className="font-semibold">5 Marker Questions</Typography>
                          </div>
                          {examConfig.questionTypes.fiveMarker.enabled && (
                            <Input
                              type="number"
                              value={examConfig.questionTypes.fiveMarker.count}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  fiveMarker: { ...examConfig.questionTypes.fiveMarker, count: parseInt(e.target.value) || 0 }
                                }
                              })}
                              min="0"
                              max="20"
                              className="!border-gray-300 w-20"
                              placeholder="Count"
                            />
                          )}
                        </div>
                      </div>

                      {/* 10 Marker Questions */}
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examConfig.questionTypes.tenMarker.enabled}
                              onChange={(e) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  tenMarker: { ...examConfig.questionTypes.tenMarker, enabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-gray-900"
                            />
                            <Typography variant="small" className="font-semibold">10 Marker Questions</Typography>
                          </div>
                          {examConfig.questionTypes.tenMarker.enabled && (
                            <Input
                              type="number"
                              value={examConfig.questionTypes.tenMarker.count}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamConfig({
                                ...examConfig,
                                questionTypes: {
                                  ...examConfig.questionTypes,
                                  tenMarker: { ...examConfig.questionTypes.tenMarker, count: parseInt(e.target.value) || 0 }
                                }
                              })}
                              min="0"
                              max="20"
                              className="!border-gray-300 w-20"
                              placeholder="Count"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleCreateExam}
                      disabled={isGenerating || !examConfig.subject || !examConfig.topic}
                      className="bg-gray-900 w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Generating Questions...
                        </>
                      ) : (
                        'Generate Exam'
                      )}
                    </Button>
                  </div>
                </CardBody>
              </Card>
              ) : (
              // Paper Upload Section
              <Card>
                <CardBody className="py-8">
                  <Typography variant="h6" className="mb-6 text-center">
                    Upload Previous Year Paper
                  </Typography>
                  <Typography variant="small" color="gray" className="mb-6 text-center">
                    Upload an image of a previous year paper and get AI-powered solutions with detailed explanations
                  </Typography>

                  {!paperSolutions ? (
                    <div className="space-y-4 max-w-md mx-auto">
                      <div>
                        <Typography variant="small" className="mb-2">Subject *</Typography>
                        <Input
                          value={paperMetadata?.subject || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaperMetadata(prev => ({ ...prev || {year: '', board: ''}, subject: e.target.value }))}
                          placeholder="e.g., Mathematics, Physics, Chemistry"
                          className="!border-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Typography variant="small" className="mb-2">Year (Optional)</Typography>
                          <Input
                            value={paperMetadata?.year || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaperMetadata(prev => ({ ...prev || {subject: '', board: ''}, year: e.target.value }))}
                            placeholder="e.g., 2023"
                            className="!border-gray-300"
                          />
                        </div>
                        <div>
                          <Typography variant="small" className="mb-2">Board (Optional)</Typography>
                          <Input
                            value={paperMetadata?.board || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaperMetadata(prev => ({ ...prev || {subject: '', year: ''}, board: e.target.value }))}
                            placeholder="e.g., CBSE, ICSE"
                            className="!border-gray-300"
                          />
                        </div>
                      </div>

                      <div>
                        <Typography variant="small" className="mb-2">Upload Paper(s) - Multiple Images/PDFs Supported *</Typography>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-900 transition-colors">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                setSelectedPaperFiles(prev => [...prev, ...files]);
                                
                                // Create previews for new files
                                files.forEach((file) => {
                                  if (file.type.startsWith('image/')) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      setPaperPreviews(prev => {
                                        const newMap = new Map(prev);
                                        newMap.set(file.name, e.target?.result as string);
                                        return newMap;
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  } else if (file.type === 'application/pdf') {
                                    setPaperPreviews(prev => {
                                      const newMap = new Map(prev);
                                      newMap.set(file.name, 'pdf');
                                      return newMap;
                                    });
                                  }
                                });
                              }
                            }}
                            className="hidden"
                            id="paper-upload"
                          />
                          <label
                            htmlFor="paper-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {selectedPaperFiles.length > 0 ? (
                              <div className="w-full space-y-3">
                                {selectedPaperFiles.map((file, index) => {
                                  const preview = paperPreviews.get(file.name);
                                  return (
                                    <div key={`${file.name}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                      {preview === 'pdf' || file.type === 'application/pdf' ? (
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <i className="fa-solid fa-file-pdf text-3xl text-red-600 flex-shrink-0"></i>
                                            <div className="flex-1 min-w-0">
                                              <Typography variant="small" className="font-medium truncate">
                                                {file.name}
                                              </Typography>
                                              <Typography variant="small" color="gray">
                                                PDF Document • {(file.size / (1024 * 1024)).toFixed(2)} MB
                                              </Typography>
                                            </div>
                                          </div>
                                          <Button
                                            variant="text"
                                            size="sm"
                                            onClick={(e: React.MouseEvent) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setSelectedPaperFiles(prev => prev.filter((f, i) => i !== index));
                                              setPaperPreviews(prev => {
                                                const newMap = new Map(prev);
                                                newMap.delete(file.name);
                                                return newMap;
                                              });
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <XMarkIcon className="w-5 h-5" />
                                          </Button>
                                        </div>
                                      ) : preview ? (
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <Typography variant="small" className="font-medium truncate flex-1">
                                              {file.name}
                                            </Typography>
                                            <Button
                                              variant="text"
                                              size="sm"
                                              onClick={(e: React.MouseEvent) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedPaperFiles(prev => prev.filter((f, i) => i !== index));
                                                setPaperPreviews(prev => {
                                                  const newMap = new Map(prev);
                                                  newMap.delete(file.name);
                                                  return newMap;
                                                });
                                              }}
                                              className="text-red-600 hover:text-red-800"
                                            >
                                              <XMarkIcon className="w-5 h-5" />
                                            </Button>
                                          </div>
                                          <img
                                            src={preview}
                                            alt={file.name}
                                            className="max-h-32 w-full object-contain rounded border border-gray-200"
                                          />
                                          <Typography variant="small" color="gray">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                          </Typography>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between">
                                          <Typography variant="small" className="truncate flex-1">
                                            {file.name} (Loading preview...)
                                          </Typography>
                                          <Button
                                            variant="text"
                                            size="sm"
                                            onClick={(e: React.MouseEvent) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setSelectedPaperFiles(prev => prev.filter((f, i) => i !== index));
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <XMarkIcon className="w-5 h-5" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                <Button
                                  variant="outlined"
                                  size="sm"
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    document.getElementById('paper-upload')?.click();
                                  }}
                                  className="mt-2 w-full"
                                >
                                  <i className="fa-solid fa-plus mr-2"></i>
                                  Add More Files
                                </Button>
                              </div>
                            ) : (
                              <>
                                <i className="fa-solid fa-cloud-upload text-4xl text-gray-400 mb-4"></i>
                                <Typography variant="small" color="gray" className="mb-2">
                                  Click to upload or drag and drop
                                </Typography>
                                <Typography variant="small" color="gray">
                                  Multiple images/PDFs supported (Max 100MB per file, 200MB total)
                                </Typography>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <Button
                        onClick={handleSolvePaper}
                        disabled={isProcessingPaper || selectedPaperFiles.length === 0 || !paperMetadata?.subject}
                        className="bg-gray-900 w-full"
                        size="lg"
                      >
                        {isProcessingPaper ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing Paper...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-brain mr-2"></i>
                            Solve Paper with AI
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    // Display Solutions
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Typography variant="h5" className="mb-2">
                          Paper Solutions
                        </Typography>
                        <Typography variant="small" color="gray">
                          {paperMetadata?.subject} {paperMetadata?.year ? `(${paperMetadata.year})` : ''} {paperMetadata?.board ? `- ${paperMetadata.board}` : ''}
                        </Typography>
                        <Typography variant="small" color="gray">
                          {paperSolutions.length} questions solved
                        </Typography>
                      </div>

                      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                        {paperSolutions.map((solution: any, index: number) => (
                          <Card key={solution.id || index} className="shadow-lg border border-gray-200">
                            <CardBody className="p-6">
                              {/* Question Header */}
                              <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                                <div>
                                  <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                                    Question {solution.questionNumber || index + 1}
                                  </Typography>
                                  {solution.type && (
                                    <Chip
                                      value={solution.type === 'multiple_choice' ? 'MCQ' : solution.type === 'short_answer' ? 'Short Answer' : 'Long Answer'}
                                      color="blue"
                                      variant="ghost"
                                      className="mt-1"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Question Text */}
                              <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 shadow-sm">
                                <Typography variant="small" className="font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">
                                  Question:
                                </Typography>
                                <div className="text-gray-900 text-lg leading-relaxed font-medium">
                                  <ScientificRenderer content={solution.question} type="math" />
                                </div>
                              </div>

                              {/* Options (if MCQ) */}
                              {solution.options && solution.options.length > 0 && (
                                <div className="mb-6">
                                  <Typography variant="small" className="font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                    Options:
                                  </Typography>
                                  <div className="space-y-3">
                                    {solution.options.map((option: string, idx: number) => {
                                      const optionLetter = String.fromCharCode(65 + idx);
                                      const isCorrect = idx === solution.correctAnswer || 
                                                       solution.correctAnswer === optionLetter || 
                                                       solution.correctAnswer === option ||
                                                       (typeof solution.correctAnswer === 'string' && solution.correctAnswer.includes(optionLetter));
                                      return (
                                        <div
                                          key={idx}
                                          className={`p-4 rounded-lg border-2 transition-all ${
                                            isCorrect
                                              ? 'bg-green-50 border-green-500 shadow-sm'
                                              : 'bg-white border-gray-200 hover:border-gray-300'
                                          }`}
                                        >
                                          <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                              isCorrect
                                                ? 'bg-green-600 text-white ring-2 ring-green-200'
                                                : 'bg-gray-200 text-gray-700'
                                            }`}>
                                              {optionLetter}
                                            </div>
                                            <div className="flex-1 text-gray-900 text-base leading-relaxed">
                                              <ScientificRenderer content={option} type="math" />
                                            </div>
                                            {isCorrect && (
                                              <div className="flex-shrink-0">
                                                <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Correct Answer */}
                              <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-600 shadow-md">
                                <div className="flex items-center gap-2 mb-3">
                                  <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                                  <Typography variant="small" className="font-bold text-green-900 uppercase tracking-wider text-xs">
                                    Correct Answer:
                                  </Typography>
                                </div>
                                <div className="text-green-900 font-bold text-lg mt-3 p-3 bg-white rounded border border-green-200">
                                  {(() => {
                                    // Handle MCQ questions - display option text if correctAnswer is an index
                                    if (solution.type === 'multiple_choice' && solution.options && solution.options.length > 0) {
                                      // Check if correctAnswer is a number (index)
                                      if (typeof solution.correctAnswer === 'number' && solution.correctAnswer >= 0 && solution.correctAnswer < solution.options.length) {
                                        const optionLetter = String.fromCharCode(65 + solution.correctAnswer);
                                        return (
                                          <>
                                            <span className="mr-2">Option {optionLetter}:</span>
                                            <ScientificRenderer content={solution.options[solution.correctAnswer]} type="math" />
                                          </>
                                        );
                                      }
                                      // Check if correctAnswer is a letter (A, B, C, D)
                                      if (typeof solution.correctAnswer === 'string') {
                                        const letterMatch = solution.correctAnswer.match(/^([A-D])/i);
                                        if (letterMatch) {
                                          const letter = letterMatch[1].toUpperCase();
                                          const index = letter.charCodeAt(0) - 65;
                                          if (index >= 0 && index < solution.options.length) {
                                            return (
                                              <>
                                                <span className="mr-2">Option {letter}:</span>
                                                <ScientificRenderer content={solution.options[index]} type="math" />
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    }
                                    // For non-MCQ or if we can't determine the option, display as-is
                                    return <ScientificRenderer content={typeof solution.correctAnswer === 'string' ? solution.correctAnswer : String(solution.correctAnswer)} type="math" />;
                                  })()}
                                </div>
                              </div>

                              {/* Explanation */}
                              {solution.explanation && (
                                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-600 shadow-md">
                                  <div className="flex items-center gap-2 mb-4">
                                    <i className="fa-solid fa-lightbulb text-blue-600 text-xl"></i>
                                    <Typography variant="small" className="font-bold text-blue-900 uppercase tracking-wider text-xs">
                                      Step-by-Step Explanation:
                                    </Typography>
                                  </div>
                                  <div className="text-blue-900 text-base leading-relaxed mt-4">
                                    {/* Format explanation with proper paragraph breaks */}
                                    {solution.explanation.split(/\n\n|\n(?=\d+\.)|(?<=\.)\s+(?=[A-Z])/).map((paragraph: string, pIdx: number) => {
                                      const trimmedPara = paragraph.trim();
                                      if (!trimmedPara) return null;
                                      
                                      // Check if it's a numbered step
                                      const isStep = /^\d+\./.test(trimmedPara);
                                      
                                      return (
                                        <div 
                                          key={pIdx} 
                                          className={`mb-3 last:mb-0 ${isStep ? 'pl-4 border-l-2 border-blue-300' : ''}`}
                                        >
                                          <ScientificRenderer content={trimmedPara} type="math" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Concepts */}
                              {solution.concepts && solution.concepts.length > 0 && (
                                <div className="pt-4 border-t border-gray-200">
                                  <div className="flex items-center gap-2 mb-3">
                                    <i className="fa-solid fa-tags text-gray-600"></i>
                                    <Typography variant="small" className="font-semibold text-gray-700 uppercase tracking-wide">
                                      Key Concepts:
                                    </Typography>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {solution.concepts.map((concept: string, idx: number) => (
                                      <Chip
                                        key={idx}
                                        value={concept}
                                        color="gray"
                                        variant="ghost"
                                        size="sm"
                                        className="bg-gray-100 text-gray-700 font-medium"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        ))}
                      </div>

                      <div className="flex gap-4 justify-center pt-4">
                        <Button
                          onClick={() => {
                            setPaperSolutions(null);
                            setSelectedPaperFiles([]);
                            setPaperPreviews(new Map());
                            setPaperMetadata(null);
                            const input = document.getElementById('paper-upload') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          variant="outlined"
                          size="lg"
                        >
                          Upload Another Paper
                        </Button>
                        <Button
                          onClick={() => {
                            setShowPaperUpload(false);
                            setPaperSolutions(null);
                            setSelectedPaperFiles([]);
                            setPaperPreviews(new Map());
                            setPaperMetadata(null);
                            const input = document.getElementById('paper-upload') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="bg-gray-900"
                          size="lg"
                        >
                          Generate New Exam
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
              )}
            </>
          ) : !examStarted ? (
            <Card>
              <CardBody>
                <Typography variant="h5" className="mb-4">
                  {examSession.title}
                </Typography>
                <div className="space-y-4">
                  <Typography>
                    Total Questions: {examSession.questions.length}
                  </Typography>
                  <Typography>
                    Estimated Time: 30 minutes
                  </Typography>
                  <Button onClick={handleStartExam} className="bg-gray-900" size="lg">
                    Start Exam
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : examCompleted ? (
            !viewResults ? (
              <Card className="max-w-2xl mx-auto">
                <CardBody className="text-center py-12">
                  <div className="mb-6">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
                      examSession.score && examSession.score >= 70 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Typography variant="h2" className={`${
                        examSession.score && examSession.score >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {examSession.score !== null && examSession.score !== undefined && typeof examSession.score === 'number' 
                          ? examSession.score.toFixed(0) 
                          : '0'}%
                      </Typography>
                    </div>
                    <Typography variant="h4" className="mb-2">
                      Exam Completed!
                    </Typography>
                    <Typography variant="h6" color="gray" className="mb-6">
                      {examSession.title}
                    </Typography>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Typography variant="small" color="gray" className="mb-1">
                        Score
                      </Typography>
                      <Typography variant="h5" className={`font-bold ${
                        examSession.score && examSession.score >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {examSession.score !== null && examSession.score !== undefined && typeof examSession.score === 'number' 
                          ? examSession.score.toFixed(1) 
                          : '0.0'}%
                      </Typography>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Typography variant="small" color="gray" className="mb-1">
                        Correct
                      </Typography>
                      <Typography variant="h5" className="font-bold text-green-600">
                        {examSession.questions.filter((q, idx) => 
                          selectedAnswers[idx] === q.correctAnswer
                        ).length} / {examSession.questions.length}
                      </Typography>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Typography variant="small" color="gray" className="mb-1">
                        Time Taken
                      </Typography>
                      <Typography variant="h5" className="font-bold">
                        {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setViewResults(true)}
                      className="bg-gray-900"
                      size="lg"
                    >
                      View Detailed Results
                    </Button>
                    <Button
                      onClick={() => {
                        setExamSession(null);
                        setExamCompleted(false);
                        setViewResults(false);
                        setSelectedAnswers([]);
                        setCurrentQuestion(0);
                        setTimeSpent(0);
                      }}
                      variant="outlined"
                      size="lg"
                    >
                      Create New Exam
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card className="max-w-4xl mx-auto">
                <CardBody>
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h5">
                      Detailed Exam Results
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => setViewResults(false)}
                    >
                      Back to Summary
                    </Button>
                  </div>

                  {/* Question Navigation */}
                  <div className="mb-6">
                    <Typography variant="small" color="gray" className="mb-2">
                      Question {reviewQuestionIndex + 1} of {examSession.questions.length}
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {examSession.questions.map((q, idx) => {
                        const isMCQ = q.type === 'mcq' || (q.options && q.options.length > 0);
                        const isCorrect = isMCQ 
                          ? selectedAnswers[idx] === q.correctAnswer 
                          : false; // Short answer questions need manual evaluation
                        const isAnswered = selectedAnswers[idx] !== undefined && 
                          (typeof selectedAnswers[idx] === 'string' 
                            ? (selectedAnswers[idx] as string).trim() !== '' 
                            : selectedAnswers[idx] !== -1);
                        return (
                          <button
                            key={idx}
                            onClick={() => setReviewQuestionIndex(idx)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                              reviewQuestionIndex === idx
                                ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2'
                                : isCorrect
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : isAnswered
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span>Correct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded"></div>
                        <span>Not Answered</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Question Review */}
                  {examSession.questions[reviewQuestionIndex] && (() => {
                    const reviewQ = examSession.questions[reviewQuestionIndex];
                    const userAnswer = selectedAnswers[reviewQuestionIndex];
                    const isMCQ = reviewQ.type === 'mcq' || (reviewQ.options && reviewQ.options.length > 0);
                    const isCorrect = isMCQ 
                      ? userAnswer === reviewQ.correctAnswer 
                      : false; // Short answer questions need manual evaluation
                    const isAnswered = userAnswer !== undefined && 
                      (typeof userAnswer === 'string' ? userAnswer.trim() !== '' : userAnswer !== -1);

                    return (
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <Typography variant="h6" className="mb-1">
                                Question {reviewQuestionIndex + 1}
                              </Typography>
                              {reviewQ.marks && (
                                <Typography variant="small" color="gray">
                                  {reviewQ.marks} Mark{reviewQ.marks > 1 ? 's' : ''} {isMCQ ? '(MCQ)' : '(Short Answer)'}
                                </Typography>
                              )}
                            </div>
                            {isMCQ && (
                              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </div>
                            )}
                          </div>
                          <div className="mb-6">
                            <ScientificRenderer content={reviewQ.question} type="auto" />
                          </div>

                          {((reviewQ.type === 'mcq' || (reviewQ.options && reviewQ.options.length > 0)) && reviewQ.options && reviewQ.options.length > 0) ? (
                            <>
                              <div className="space-y-3 mb-6">
                                {reviewQ.options.map((option, idx) => {
                                  const isUserAnswer = idx === userAnswer;
                                  const isCorrectAnswer = idx === reviewQ.correctAnswer;
                                  const isBoth = isUserAnswer && isCorrectAnswer;
                                  
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-4 rounded-lg border-2 ${
                                        isBoth
                                          ? 'bg-green-50 border-green-500 border-2'
                                          : isCorrectAnswer
                                          ? 'bg-green-50 border-green-500'
                                          : isUserAnswer && !isCorrectAnswer
                                          ? 'bg-red-50 border-red-500'
                                          : 'bg-white border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm ${
                                          isBoth
                                            ? 'bg-green-600 text-white ring-2 ring-green-300'
                                            : isCorrectAnswer
                                            ? 'bg-green-500 text-white'
                                            : isUserAnswer
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                          {String.fromCharCode(65 + idx)}
                                        </div>
                                        <div className="flex-1">
                                          <ScientificRenderer content={option} type="auto" />
                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {isCorrectAnswer && (
                                              <Typography variant="small" className="text-green-700 font-semibold">
                                                ✓ Correct Answer
                                              </Typography>
                                            )}
                                            {isUserAnswer && (
                                              <Typography variant="small" className={`font-semibold ${
                                                isCorrectAnswer ? 'text-green-700' : 'text-red-700'
                                              }`}>
                                                {isCorrectAnswer ? '✓' : '✗'} Your Choice
                                              </Typography>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Correct Answer Summary */}
                              <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-600 shadow-md">
                                <div className="flex items-center gap-2 mb-3">
                                  <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                                  <Typography variant="small" className="font-bold text-green-900 uppercase tracking-wider text-xs">
                                    Correct Answer:
                                  </Typography>
                                </div>
                                <div className="text-green-900 font-bold text-lg mt-3 p-3 bg-white rounded border border-green-200">
                                  {(() => {
                                    // Use finalAnswer if available, otherwise derive from correctAnswer
                                    if (reviewQ.finalAnswer) {
                                      return <ScientificRenderer content={reviewQ.finalAnswer} type="math" />;
                                    }
                                    // Fallback: derive from correctAnswer
                                    if (typeof reviewQ.correctAnswer === 'number' && reviewQ.options && reviewQ.options[reviewQ.correctAnswer]) {
                                      return (
                                        <>
                                          <span className="mr-2">Option {String.fromCharCode(65 + reviewQ.correctAnswer)}:</span>
                                          <ScientificRenderer content={reviewQ.options[reviewQ.correctAnswer]} type="math" />
                                        </>
                                      );
                                    }
                                    return <ScientificRenderer content={typeof reviewQ.correctAnswer === 'string' ? reviewQ.correctAnswer : String(reviewQ.correctAnswer)} type="auto" />;
                                  })()}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              {/* Question Marks Badge */}
                              {reviewQ.marks && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    reviewQ.marks === 2 ? 'bg-blue-100 text-blue-700' :
                                    reviewQ.marks === 5 ? 'bg-purple-100 text-purple-700' :
                                    reviewQ.marks === 10 ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {reviewQ.marks} Mark{reviewQ.marks > 1 ? 's' : ''} Question
                                  </div>
                                </div>
                              )}
                              
                              {/* Your Answer */}
                              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <i className="fa-solid fa-pen text-gray-600 text-lg"></i>
                                  <Typography variant="small" className="font-bold text-gray-900 uppercase tracking-wider text-xs">
                                    Your Answer:
                                  </Typography>
                                </div>
                                <div className="text-gray-900 whitespace-pre-wrap p-3 bg-white rounded border border-gray-200 mt-2">
                                  {typeof userAnswer === 'string' && userAnswer.trim() !== '' ? (
                                    <ScientificRenderer content={userAnswer} type="auto" />
                                  ) : (
                                    <Typography variant="small" className="text-gray-500 italic">
                                      No answer provided
                                    </Typography>
                                  )}
                                </div>
                              </div>
                              
                              {/* Correct Answer Summary */}
                              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-600 shadow-md">
                                <div className="flex items-center gap-2 mb-3">
                                  <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                                  <Typography variant="small" className="font-bold text-green-900 uppercase tracking-wider text-xs">
                                    Correct Answer:
                                  </Typography>
                                </div>
                                <div className="text-green-900 font-semibold text-base mt-3 p-4 bg-white rounded border border-green-200">
                                  <ScientificRenderer content={reviewQ.finalAnswer || (typeof reviewQ.correctAnswer === 'string' ? reviewQ.correctAnswer : String(reviewQ.correctAnswer))} type="auto" />
                                </div>
                              </div>
                              
                              {/* Key Points to Include */}
                              {reviewQ.keyPoints && reviewQ.keyPoints.length > 0 && (
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-600 shadow-md">
                                  <div className="flex items-center gap-2 mb-3">
                                    <i className="fa-solid fa-list-check text-blue-600 text-lg"></i>
                                    <Typography variant="small" className="font-bold text-blue-900 uppercase tracking-wider text-xs">
                                      Key Points to Include ({reviewQ.marks || 0} marks):
                                    </Typography>
                                  </div>
                                  <ul className="list-disc list-inside space-y-2 mt-3">
                                    {reviewQ.keyPoints.map((point, idx) => (
                                      <li key={idx} className="text-blue-900 text-sm p-2 bg-white rounded border border-blue-200">
                                        <ScientificRenderer content={point} type="auto" />
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Marks Breakdown (for 5 and 10 marker questions) */}
                              {(reviewQ.marks === 5 || reviewQ.marks === 10) && (
                                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                                  <Typography variant="small" className="font-semibold text-yellow-900 mb-2">
                                    <i className="fa-solid fa-info-circle mr-2"></i>
                                    Marking Guide:
                                  </Typography>
                                  <div className="text-yellow-800 text-sm">
                                    <Typography variant="small" className="text-yellow-800 mb-2">
                                      This is a {reviewQ.marks}-mark question. Your answer will be evaluated based on:
                                    </Typography>
                                    {reviewQ.marks === 5 && (
                                      <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                                        <li>Correct approach and method (2 marks)</li>
                                        <li>Accurate calculations and steps (2 marks)</li>
                                        <li>Final answer and conclusion (1 mark)</li>
                                      </ul>
                                    )}
                                    {reviewQ.marks === 10 && (
                                      <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                                        <li>Correct approach and methodology (3 marks)</li>
                                        <li>Detailed step-by-step solution (4 marks)</li>
                                        <li>Accurate calculations and reasoning (2 marks)</li>
                                        <li>Final answer and conclusion (1 mark)</li>
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Explanation */}
                        {reviewQ.explanation && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                              <i className="fa-solid fa-lightbulb text-blue-600 text-xl"></i>
                              <Typography variant="small" className="font-bold text-blue-900 uppercase tracking-wider text-xs">
                                Step-by-Step Explanation:
                              </Typography>
                            </div>
                            <div className="text-blue-900 text-base leading-relaxed">
                              {/* Format explanation with proper paragraph breaks and step formatting */}
                              {reviewQ.explanation.split(/\n\n|\n(?=\d+\.)|(?<=\.)\s+(?=[A-Z])|(?=Step \d+)/i).map((paragraph: string, pIdx: number) => {
                                const trimmedPara = paragraph.trim();
                                if (!trimmedPara) return null;
                                
                                // Check if it's a numbered step
                                const isStep = /^(Step \d+|Step\d+|\d+\.)/i.test(trimmedPara);
                                
                                return (
                                  <div 
                                    key={pIdx} 
                                    className={`mb-3 last:mb-0 ${isStep ? 'pl-4 border-l-2 border-blue-300' : ''}`}
                                  >
                                    <ScientificRenderer content={trimmedPara} type="math" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between">
                          <Button
                            onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                            disabled={reviewQuestionIndex === 0}
                            variant="outlined"
                          >
                            Previous Question
                          </Button>
                          <Button
                            onClick={() => setReviewQuestionIndex(Math.min(examSession.questions.length - 1, reviewQuestionIndex + 1))}
                            disabled={reviewQuestionIndex === examSession.questions.length - 1}
                            className="bg-gray-900"
                          >
                            Next Question
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>
            )
          ) : currentQ ? (
            <Card className="max-w-3xl mx-auto">
              <CardBody>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Typography>
                      Question {currentQuestion + 1} of {examSession.questions.length}
                    </Typography>
                    {currentQ.marks && (
                      <Typography variant="small" color="gray">
                        {currentQ.marks} Mark{currentQ.marks > 1 ? 's' : ''} {((currentQ.type === 'mcq' || (currentQ.options && currentQ.options.length > 0)) ? '(MCQ)' : '(Short Answer)')}
                      </Typography>
                    )}
                  </div>
                  <Typography>
                    Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                  </Typography>
                </div>

                <div className="mb-6">
                  <ScientificRenderer content={currentQ.question} type="auto" />
                </div>

                {((currentQ.type === 'mcq' || (currentQ.options && currentQ.options.length > 0)) && currentQ.options && currentQ.options.length > 0) ? (
                  <div className="space-y-3 mb-6">
                    {currentQ.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAnswerSelect(idx)}
                      >
                        <Radio
                          name={`question-${currentQuestion}`}
                          checked={selectedAnswers[currentQuestion] === idx}
                          onChange={() => handleAnswerSelect(idx)}
                        />
                        <span className="ml-3">
                          <ScientificRenderer content={option} type="auto" />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <Typography variant="small" color="gray" className="mb-2">
                      Type your answer below ({currentQ.marks || 0} marks):
                    </Typography>
                    <textarea
                      value={typeof selectedAnswers[currentQuestion] === 'string' ? selectedAnswers[currentQuestion] as string : ''}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      placeholder="Enter your detailed answer here..."
                      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 min-h-[200px] resize-y"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outlined"
                  >
                    Previous
                  </Button>
                  <div>
                    {currentQuestion === examSession.questions.length - 1 ? (
                      <Button
                        onClick={handleSubmitExam}
                        className="bg-green-600"
                        size="lg"
                      >
                        Submit Exam
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion} className="bg-gray-900">
                        Next Question
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
