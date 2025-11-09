"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Button, Card, CardBody, Input, Textarea, IconButton } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { ScientificRenderer } from '@/components';
import { formatTextWithHTML } from '@/utils/textFormatter';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton, { CardGridSkeleton } from '@/components/loading-skeleton';
import AppSidebar from '@/components/app-sidebar';

interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[] | string; // Can be array or comma-separated string
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '', tags: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateTopic, setGenerateTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateFormat, setGenerateFormat] = useState('structured');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  // Helper function to normalize tags (convert string to array)
  const normalizeTags = (tags: string[] | string | null | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
  };

  // Helper function to format note content (convert markdown to HTML)
  const formatNoteContent = (content: string): string => {
    if (!content) return '';
    
    // First, normalize line endings and clean up
    let normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Split into lines for processing
    const lines = normalized.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let listType = '';
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let inParagraph = false;
    let paragraphContent: string[] = [];
    
    // Helper to process inline formatting (bold, italic, code)
    const processInlineFormatting = (text: string): string => {
      if (!text) return '';
      // Process code blocks first (to protect them)
      let processed = text;
      // Process bold (**text**)
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Process italic (*text*) - but not if it's part of **text**
      processed = processed.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
      // Process inline code (`code`)
      processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
      return processed;
    };
    
    // Helper to close current paragraph
    const closeParagraph = () => {
      if (inParagraph && paragraphContent.length > 0) {
        const paraText = paragraphContent.join(' ').trim();
        if (paraText) {
          processedLines.push(`<p>${processInlineFormatting(paraText)}</p>`);
        }
        paragraphContent = [];
        inParagraph = false;
      }
    };
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const isEmpty = trimmed === '';
      
      // Handle code blocks
      if (trimmed.startsWith('```')) {
        closeParagraph();
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = '';
        }
        if (inCodeBlock) {
          // Close code block
          processedLines.push(`<pre><code>${codeBlockContent.join('\n')}</code></pre>`);
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      // Handle headings (must be at start of line)
      if (/^#{1,6}\s/.test(trimmed)) {
        closeParagraph();
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = '';
        }
        const match = trimmed.match(/^(#{1,6})\s(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          processedLines.push(`<h${level}>${processInlineFormatting(text)}</h${level}>`);
        }
        return;
      }
      
      // Handle unordered lists (- or *)
      if (/^[-*]\s/.test(trimmed)) {
        closeParagraph();
        if (!inList || listType !== 'ul') {
          if (inList && listType === 'ol') {
            processedLines.push('</ol>');
          }
          processedLines.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        const listContent = trimmed.replace(/^[-*]\s+/, '');
        processedLines.push(`<li>${processInlineFormatting(listContent)}</li>`);
        return;
      }
      
      // Handle ordered lists (1., 2., etc.)
      if (/^\d+\.\s/.test(trimmed)) {
        closeParagraph();
        if (!inList || listType !== 'ol') {
          if (inList && listType === 'ul') {
            processedLines.push('</ul>');
          }
          processedLines.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        const listContent = trimmed.replace(/^\d+\.\s+/, '');
        processedLines.push(`<li>${processInlineFormatting(listContent)}</li>`);
        return;
      }
      
      // Handle section headings (lines that are short, capitalized, and standalone)
      // This handles cases like "Introduction", "Key Rulers", "Cultural Contributions"
      if (!isEmpty && trimmed.length < 100 && /^[A-Z]/.test(trimmed)) {
        const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
        const prevLine = index > 0 ? lines[index - 1].trim() : '';
        
        // Common section heading patterns
        const commonHeadings = [
          'introduction', 'conclusion', 'summary', 'overview', 'background',
          'key terms', 'examples', 'references', 'notes', 'appendix',
          'key rulers', 'cultural contributions', 'administrative system',
          'decline', 'rise', 'fall', 'history', 'timeline'
        ];
        
        // Check if it looks like a heading
        const isCommonHeading = commonHeadings.some(h => trimmed.toLowerCase() === h || trimmed.toLowerCase().startsWith(h));
        const wordCount = trimmed.split(/\s+/).length;
        const isShortCapitalized = trimmed.length < 50 && /^[A-Z][a-zA-Z\s]*$/.test(trimmed) && wordCount <= 4;
        const hasContentAfter = nextLine !== '' && nextLine.length > 10;
        const prevLineEnds = prevLine === '' || prevLine.endsWith('.') || prevLine.endsWith(':') || prevLine.match(/^\d+\./);
        
        const looksLikeHeading = 
          (isCommonHeading || (isShortCapitalized && hasContentAfter && wordCount >= 1)) &&
          prevLineEnds &&
          !trimmed.includes(':') && !trimmed.includes('**') &&
          !trimmed.match(/^\d+\./);
        
        if (looksLikeHeading) {
          closeParagraph();
          if (inList) {
            processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
            inList = false;
            listType = '';
          }
          // Use h2 for section headings
          processedLines.push(`<h2>${processInlineFormatting(trimmed)}</h2>`);
          return;
        }
      }
      
      // Handle lines that look like list items (text followed by colon, then description)
      // This handles cases like "Architecture: The Mughals are renowned..."
      if (trimmed.includes(':') && !trimmed.startsWith('http') && trimmed.length > 10) {
        const colonIndex = trimmed.indexOf(':');
        const beforeColon = trimmed.substring(0, colonIndex).trim();
        const afterColon = trimmed.substring(colonIndex + 1).trim();
        
        // Check if it looks like a list item (short label before colon, followed by description)
        if (beforeColon.length < 60 && afterColon.length > 0) {
          // Check if previous line was also a similar pattern or if we're starting a new section
          const prevLine = index > 0 ? lines[index - 1].trim() : '';
          const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
          const isListItemPattern = /^[A-Z][^:]*:\s/.test(trimmed);
          const prevIsListItem = /^[A-Z][^:]*:\s/.test(prevLine);
          const nextIsListItem = /^[A-Z][^:]*:\s/.test(nextLine);
          
          // If it matches the pattern and is part of a sequence of similar items
          if (isListItemPattern && (prevIsListItem || nextIsListItem || inList || prevLine === '')) {
            closeParagraph();
            if (!inList || listType !== 'ul') {
              if (inList && listType === 'ol') {
                processedLines.push('</ol>');
              }
              processedLines.push('<ul>');
              inList = true;
              listType = 'ul';
            }
            processedLines.push(`<li><strong>${processInlineFormatting(beforeColon)}:</strong> ${processInlineFormatting(afterColon)}</li>`);
            return;
          }
        }
      }
      
      // Regular text line
      if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = '';
      }
      
      if (isEmpty) {
        closeParagraph();
        // Don't add extra breaks between paragraphs
        if (processedLines.length > 0 && !processedLines[processedLines.length - 1].endsWith('</p>')) {
          processedLines.push('<br>');
        }
      } else {
        // Add to current paragraph or start new one
        if (!inParagraph) {
          inParagraph = true;
          paragraphContent = [];
        }
        paragraphContent.push(trimmed);
      }
    });
    
    // Close any open structures
    closeParagraph();
    if (inCodeBlock) {
      processedLines.push(`<pre><code>${codeBlockContent.join('\n')}</code></pre>`);
    }
    if (inList) {
      processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    
    return processedLines.join('\n');
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, selectedCategory]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const url = `/api/notes?userId=${user?.id}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      // Normalize tags for all notes (convert string to array if needed)
      const normalizedNotes = (data.notes || []).map((note: any) => ({
        ...note,
        tags: normalizeTags(note.tags)
      }));
      setNotes(normalizedNotes);
      
      const cats = [...new Set((data.notes || []).map((n: any) => n.category).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = async () => {
    if (!editingNote) return;

    try {
      const tagsArray = normalizeTags(editingNote.tags);
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: editingNote.id,
          title: editingNote.title,
          content: editingNote.content,
          category: editingNote.category,
          tags: tagsArray
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchNotes();
        setEditingNote(null);
      } else {
        throw new Error(data.error || 'Failed to update note');
      }
    } catch (error: any) {
      console.error('Error updating note:', error);
      alert(error.message || 'Failed to update note. Please try again.');
    }
  };

  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const tagsArray = normalizeTags(note.tags);
      return note.title.toLowerCase().includes(query) ||
             note.content.toLowerCase().includes(query) ||
             note.category?.toLowerCase().includes(query) ||
             tagsArray.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  const handleGenerateNotes = async () => {
    if (!generateTopic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          topic: generateTopic.trim(),
          format: generateFormat,
          autoSave: true,
          category: 'AI Generated',
          tags: ['AI Generated']
        })
      });

      const data = await response.json();
      if (data.success) {
        // If auto-saved, refresh notes
        if (data.autoSaved) {
          fetchNotes();
          setGenerateTopic('');
          setShowGenerate(false);
          alert('Notes generated and saved successfully!');
        } else {
          // If not auto-saved, populate the create form
          setNewNote({
            title: data.note.title,
            content: data.note.content,
            category: 'AI Generated',
            tags: 'AI Generated'
          });
          setShowGenerate(false);
          setShowCreate(true);
          setGenerateTopic('');
        }
      } else {
        throw new Error(data.error || 'Failed to generate notes');
      }
    } catch (error: any) {
      console.error('Error generating notes:', error);
      alert('Failed to generate notes: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content) {
      setSaveError('Title and content are required');
      return;
    }

    if (!user?.id) {
      setSaveError('You must be logged in to create notes');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const tagsArray = newNote.tags.split(',').map(t => t.trim()).filter(Boolean);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          category: newNote.category || undefined,
          tags: tagsArray,
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || `Failed to create note (${response.status})`;
        console.error('API Error:', data);
        throw new Error(errorMsg);
      }

      if (data.success) {
        setShowCreate(false);
        setNewNote({ title: '', content: '', category: '', tags: '' });
        setSaveError(null);
        fetchNotes();
      } else {
        throw new Error(data.error || 'Failed to create note');
      }
    } catch (error: any) {
      console.error('Error creating note:', error);
      setSaveError(error.message || 'Failed to create note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes?id=${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        fetchNotes();
      } else {
        alert(data.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden hover:bg-gray-100"
                >
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <Typography variant="h5" color="blue-gray" className="font-bold">
                My Notes
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowGenerate(true)} className="bg-gray-800 text-white hover:bg-gray-700">
                <i className="fa-solid fa-magic mr-2"></i>
                Generate with AI
              </Button>
              <Button onClick={() => setShowCreate(!showCreate)} className="bg-gray-900">
                <i className="fa-solid fa-plus mr-2"></i>
                Create Note
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <Input
                    label="Search notes..."
                    icon={<i className="fa-solid fa-search"></i>}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCategory('all')}
                    size="sm"
                    className={selectedCategory === 'all' ? 'bg-gray-900' : ''}
                  >
                    All
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'filled' : 'outlined'}
                      onClick={() => setSelectedCategory(cat)}
                      size="sm"
                      className={selectedCategory === cat ? 'bg-gray-900' : ''}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Notes Modal */}
              {showGenerate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowGenerate(false)}>
                  <Card className="bg-white w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                    <CardBody className="p-6">
                      <Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                        Generate Notes with AI
                      </Typography>
                      <Input
                        label="Enter Topic"
                        value={generateTopic}
                        onChange={(e) => setGenerateTopic(e.target.value)}
                        className="mb-4"
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateNotes()}
                      />
                      <div className="mb-4">
                        <Typography variant="small" color="gray" className="mb-2">
                          Format:
                        </Typography>
                        <div className="flex gap-2">
                          <Button
                            variant={generateFormat === 'structured' ? 'filled' : 'outlined'}
                            onClick={() => setGenerateFormat('structured')}
                            size="sm"
                            className={generateFormat === 'structured' ? 'bg-gray-900' : ''}
                          >
                            Structured
                          </Button>
                          <Button
                            variant={generateFormat === 'outline' ? 'filled' : 'outlined'}
                            onClick={() => setGenerateFormat('outline')}
                            size="sm"
                            className={generateFormat === 'outline' ? 'bg-gray-900' : ''}
                          >
                            Outline
                          </Button>
                          <Button
                            variant={generateFormat === 'summary' ? 'filled' : 'outlined'}
                            onClick={() => setGenerateFormat('summary')}
                            size="sm"
                            className={generateFormat === 'summary' ? 'bg-gray-900' : ''}
                          >
                            Summary
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleGenerateNotes}
                          disabled={isGenerating}
                          className="bg-gray-900 flex-1"
                        >
                          {isGenerating ? 'Generating...' : 'Generate'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowGenerate(false);
                            setGenerateTopic('');
                          }}
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* Create Note Modal */}
              {showCreate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => {
                  setShowCreate(false);
                  setNewNote({ title: '', content: '', category: '', tags: '' });
                }}>
                  <Card className="bg-white w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="font-bold">
                          Create New Note
                        </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setShowCreate(false);
                            setNewNote({ title: '', content: '', category: '', tags: '' });
                          }}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>
                      <Input
                        label="Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="mb-4"
                      />
                      <Textarea
                        label="Content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        rows={10}
                        className="mb-4"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="Category (optional)"
                          value={newNote.category}
                          onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                        />
                        <Input
                          label="Tags (comma separated)"
                          value={newNote.tags}
                          onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                        />
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
                            setNewNote({ title: '', content: '', category: '', tags: '' });
                            setSaveError(null);
                          }} 
                          variant="outlined"
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateNote} 
                          className="bg-gray-900"
                          disabled={isSaving || !newNote.title || !newNote.content}
                        >
                          {isSaving ? 'Saving...' : 'Save Note'}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* View Note Modal */}
              {viewingNote && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                  onClick={() => setViewingNote(null)}
                  style={{ maxHeight: '100vh', overflow: 'auto' }}
                >
                  <Card 
                    className="bg-white w-full max-w-4xl my-4" 
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      maxHeight: 'calc(100vh - 2rem)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    <CardBody 
                      className="p-6 flex flex-col"
                      style={{ 
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                    >
                      {/* Header - Fixed */}
                      <div className="flex items-start justify-between mb-4 flex-shrink-0">
                        <div className="flex-1 pr-4">
                          <Typography variant="h4" className="font-bold mb-2 break-words">
                            {viewingNote.title}
                          </Typography>
                          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                            {viewingNote.category && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full">
                                {viewingNote.category}
                              </span>
                            )}
                            <span>
                              {new Date(viewingNote.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => {
                              setViewingNote(null);
                              setEditingNote(viewingNote);
                            }}
                            className="border-gray-900 text-gray-900"
                          >
                            <i className="fa-solid fa-edit mr-2"></i>
                            Edit
                          </Button>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => setViewingNote(null)}
                          >
                            <i className="fa-solid fa-times"></i>
                          </IconButton>
                        </div>
                      </div>
                      
                      {/* Tags - Fixed */}
                      {(() => {
                        const tagsArray = normalizeTags(viewingNote.tags);
                        return tagsArray.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                            {tagsArray.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      
                      {/* Note Content - Scrollable */}
                      <div 
                        className="prose prose-lg max-w-none border-t border-gray-200 pt-6 flex-1 overflow-y-auto"
                        style={{ 
                          minHeight: 0,
                          maxHeight: 'calc(100vh - 300px)'
                        }}
                      >
                        <ScientificRenderer 
                          content={formatNoteContent(viewingNote.content)} 
                          type="auto" 
                          className="text-gray-900"
                        />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* Edit Note Modal */}
              {editingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setEditingNote(null)}>
                  <Card className="bg-white w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="font-bold">
                          Edit Note
                        </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => setEditingNote(null)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>
                      <Input
                        label="Title"
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                        className="mb-4"
                      />
                      <Textarea
                        label="Content"
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                        rows={10}
                        className="mb-4"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="Category (optional)"
                          value={editingNote.category || ''}
                          onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                        />
                        <Input
                          label="Tags (comma separated)"
                          value={Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : (editingNote.tags || '')}
                          onChange={(e) => {
                            const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                            setEditingNote({ ...editingNote, tags: tagsArray });
                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button onClick={() => setEditingNote(null)} variant="outlined">
                          Cancel
                        </Button>
                        <Button onClick={handleEditNote} className="bg-gray-900">
                          Update Note
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* Notes List */}
              {isLoading ? (
                <CardGridSkeleton count={6} />
              ) : filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-sticky-note text-4xl text-gray-400"></i>
                  </div>
                  <Typography variant="h5" color="gray" className="mb-2 font-semibold">
                    No notes yet
                  </Typography>
                  <Typography color="gray" className="mb-6 text-center max-w-md">
                    Get started by creating your first note or generating one with AI
                  </Typography>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowCreate(true)} className="bg-gray-900">
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create Note
                    </Button>
                    <Button onClick={() => setShowGenerate(true)} variant="outlined" className="border-gray-900 text-gray-900">
                      <i className="fa-solid fa-magic mr-2"></i>
                      Generate with AI
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="h-full hover:shadow-lg transition-shadow">
                      <CardBody>
                        <div className="flex items-start justify-between mb-2">
                          <Typography 
                            variant="h6" 
                            className="flex-1 line-clamp-2 cursor-pointer hover:text-gray-600"
                            onClick={() => setViewingNote(note)}
                          >
                            {note.title}
                          </Typography>
                          <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => setViewingNote(note)}
                              title="View Note"
                            >
                              <i className="fa-solid fa-eye text-green-500"></i>
                            </IconButton>
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => setEditingNote(note)}
                              title="Edit Note"
                            >
                              <i className="fa-solid fa-edit text-blue-500"></i>
                            </IconButton>
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Delete Note"
                            >
                              <i className="fa-solid fa-trash text-red-500"></i>
                            </IconButton>
                          </div>
                        </div>
                        {note.category && (
                          <Typography className="text-xs text-gray-600 mb-2">
                            {note.category}
                          </Typography>
                        )}
                        <div className="text-sm min-h-[100px] mb-4 line-clamp-4">
                          <ScientificRenderer 
                            content={formatNoteContent(note.content.substring(0, 200))} 
                            type="auto" 
                          />
                          {note.content.length > 200 && <span>...</span>}
                        </div>
                        {(() => {
                          const tagsArray = normalizeTags(note.tags);
                          return tagsArray.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {tagsArray.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-900 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {tagsArray.length > 3 && (
                                <span className="px-2 py-1 text-gray-500 text-xs">
                                  +{tagsArray.length - 3}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                        <Typography className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
