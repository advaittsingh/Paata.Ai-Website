"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Button, Card, CardBody, IconButton, Input, Textarea } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { ScientificRenderer } from '@/components';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton, { CardGridSkeleton } from '@/components/loading-skeleton';
import AppSidebar from '@/components/app-sidebar';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty: string;
  masteryLevel: number;
  lastReviewed?: string;
}

export default function FlashcardsPage() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newFlashcard, setNewFlashcard] = useState({
    question: '',
    answer: '',
    category: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user, reviewMode]);

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      const url = `/api/flashcards?userId=${user?.id}${reviewMode ? '&reviewOnly=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setFlashcards(data.flashcards || []);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (masteryLevel: number) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    try {
      await fetch('/api/flashcards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentCard.id,
          masteryLevel,
          lastReviewed: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating mastery:', error);
    }

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Completed review session
      setSessionActive(false);
      setCurrentIndex(0);
      setShowAnswer(false);
      fetchFlashcards();
    }
  };

  const markMastery = async (level: number) => {
    await handleNext(level);
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!flashcardId) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this flashcard? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/flashcards?id=${flashcardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        // Refresh flashcards list
        await fetchFlashcards();
        // If we deleted the current card, reset index
        if (currentIndex >= flashcards.length - 1) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      } else {
        alert('Failed to delete flashcard');
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      alert('Failed to delete flashcard. Please try again.');
    }
  };

  const handleCreateFlashcard = async () => {
    if (!newFlashcard.question || !newFlashcard.answer) {
      setSaveError('Please fill in both question and answer');
      return;
    }

    if (!user?.id) {
      setSaveError('You must be logged in to create flashcards');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: newFlashcard.question,
          answer: newFlashcard.answer,
          category: newFlashcard.category || undefined,
          difficulty: newFlashcard.difficulty,
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || `Failed to create flashcard (${response.status})`;
        console.error('API Error:', data);
        throw new Error(errorMsg);
      }

      if (data.success) {
        setShowCreate(false);
        setNewFlashcard({ question: '', answer: '', category: '', difficulty: 'medium' });
        setSaveError(null);
        fetchFlashcards();
      } else {
        throw new Error(data.error || 'Failed to create flashcard');
      }
    } catch (error: any) {
      console.error('Error creating flashcard:', error);
      setSaveError(error.message || 'Failed to create flashcard. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentCard = flashcards[currentIndex];

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
              <Typography variant="h5" color="blue-gray" className="font-bold">Flashcards</Typography>
            </div>
            <div className="flex gap-2">
              <Button
                variant={reviewMode ? 'filled' : 'outlined'}
                onClick={() => {
                  setReviewMode(!reviewMode);
                  setSessionActive(!sessionActive);
                }}
                className={reviewMode ? 'bg-gray-900' : ''}
              >
                <i className={`fa-solid ${reviewMode ? 'fa-stop-circle' : 'fa-play-circle'} mr-2`}></i>
                {reviewMode ? 'Exit Review Mode' : 'Start Review'}
              </Button>
              {!reviewMode && (
                <Button variant="outlined" onClick={() => setShowCreate(true)}>
                  <i className="fa-solid fa-plus mr-2"></i>
                  Create Flashcard
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
          
              {/* Create Flashcard Modal */}
              {showCreate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => {
                  setShowCreate(false);
                  setNewFlashcard({ question: '', answer: '', category: '', difficulty: 'medium' });
                  setSaveError(null);
                }}>
                  <Card className="bg-white w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="font-bold">
                          Create New Flashcard
                        </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setShowCreate(false);
                            setNewFlashcard({ question: '', answer: '', category: '', difficulty: 'medium' });
                            setSaveError(null);
                          }}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>
                      <Textarea
                        label="Question"
                        value={newFlashcard.question}
                        onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                        className="mb-4"
                        rows={4}
                      />
                      <Textarea
                        label="Answer"
                        value={newFlashcard.answer}
                        onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                        className="mb-4"
                        rows={4}
                      />
                      <Input
                        label="Category (optional)"
                        value={newFlashcard.category}
                        onChange={(e) => setNewFlashcard({ ...newFlashcard, category: e.target.value })}
                        className="mb-4"
                      />
                      <div className="flex items-center gap-4 mb-4">
                        <Typography variant="small" className="font-semibold">Difficulty:</Typography>
                        <Button
                          variant={newFlashcard.difficulty === 'easy' ? 'filled' : 'outlined'}
                          onClick={() => setNewFlashcard({ ...newFlashcard, difficulty: 'easy' })}
                          size="sm"
                          className={newFlashcard.difficulty === 'easy' ? 'bg-green-600' : ''}
                        >
                          Easy
                        </Button>
                        <Button
                          variant={newFlashcard.difficulty === 'medium' ? 'filled' : 'outlined'}
                          onClick={() => setNewFlashcard({ ...newFlashcard, difficulty: 'medium' })}
                          size="sm"
                          className={newFlashcard.difficulty === 'medium' ? 'bg-yellow-600' : ''}
                        >
                          Medium
                        </Button>
                        <Button
                          variant={newFlashcard.difficulty === 'hard' ? 'filled' : 'outlined'}
                          onClick={() => setNewFlashcard({ ...newFlashcard, difficulty: 'hard' })}
                          size="sm"
                          className={newFlashcard.difficulty === 'hard' ? 'bg-red-600' : ''}
                        >
                          Hard
                        </Button>
                      </div>
                      {saveError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <Typography className="text-sm text-red-600">
                            {saveError}
                          </Typography>
                        </div>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button 
                          onClick={() => {
                            setShowCreate(false);
                            setNewFlashcard({ question: '', answer: '', category: '', difficulty: 'medium' });
                            setSaveError(null);
                          }} 
                          variant="outlined"
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateFlashcard} 
                          className="bg-gray-900"
                          disabled={isSaving || !newFlashcard.question || !newFlashcard.answer}
                        >
                          {isSaving ? 'Creating...' : 'Create Flashcard'}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {isLoading ? (
                <CardGridSkeleton count={3} />
              ) : flashcards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-lightbulb text-4xl text-gray-400"></i>
                  </div>
                  <Typography variant="h5" color="gray" className="mb-2 font-semibold">
                    No flashcards yet
                  </Typography>
                  <Typography color="gray" className="mb-6 text-center max-w-md">
                    Create flashcards to start practicing and improve your memory!
                  </Typography>
                  <Button onClick={() => setShowCreate(true)} className="bg-gray-900">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Create Flashcard
                  </Button>
                </div>
              ) : currentCard ? (
            <Card className="max-w-2xl mx-auto min-h-96">
              <CardBody className="flex flex-col items-center justify-center h-full p-8">
                <div className="mb-4 text-center">
                  <Typography className="text-sm text-gray-500">
                    Card {currentIndex + 1} of {flashcards.length}
                  </Typography>
                  {sessionActive && (
                    <Typography className="text-xs text-purple-600 mt-1">
                      Review Mode Active
                    </Typography>
                  )}
                </div>

                {!showAnswer ? (
                  <>
                    <Typography variant="h5" className="mb-6 text-center">
                      Question
                    </Typography>
                    <div className="text-center w-full min-h-[150px] flex items-center justify-center">
                      <ScientificRenderer content={currentCard.question} type="auto" />
                    </div>
                    <Button
                      onClick={() => setShowAnswer(true)}
                      className="mt-8 bg-gray-900 px-8"
                      size="lg"
                    >
                      <i className="fa-solid fa-eye mr-2"></i>
                      Show Answer
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" className="mb-6 text-center">
                      Answer
                    </Typography>
                    <div className="text-center w-full min-h-[150px] flex items-center justify-center">
                      <ScientificRenderer content={currentCard.answer} type="auto" />
                    </div>
                    
                    {currentCard.category && (
                      <Typography className="text-sm text-gray-600 mb-4">
                        Category: {currentCard.category}
                      </Typography>
                    )}

                    <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
                      <Typography className="text-center text-sm mb-2">
                        How well did you know this?
                      </Typography>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => markMastery(25)}
                          color="red"
                          variant="outlined"
                          size="sm"
                          className="py-2"
                        >
                          <i className="fa-solid fa-times mr-2"></i>
                          Need Review
                        </Button>
                        <Button
                          onClick={() => markMastery(50)}
                          color="yellow"
                          variant="outlined"
                          size="sm"
                          className="py-2"
                        >
                          <i className="fa-solid fa-hourglass-half mr-2"></i>
                          Getting There
                        </Button>
                        <Button
                          onClick={() => markMastery(75)}
                          color="blue"
                          variant="outlined"
                          size="sm"
                          className="py-2"
                        >
                          <i className="fa-solid fa-check mr-2"></i>
                          Good
                        </Button>
                        <Button
                          onClick={() => markMastery(100)}
                          color="green"
                          variant="outlined"
                          size="sm"
                          className="py-2"
                        >
                          <i className="fa-solid fa-star mr-2"></i>
                          Mastered
                        </Button>
                      </div>
                      {!reviewMode && (
                        <Button
                          onClick={() => handleDeleteFlashcard(currentCard.id)}
                          color="red"
                          variant="outlined"
                          size="sm"
                          className="py-2 mt-2"
                        >
                          <i className="fa-solid fa-trash mr-2"></i>
                          Delete Flashcard
                        </Button>
                      )}
                    </div>
                  </>
                )}
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
