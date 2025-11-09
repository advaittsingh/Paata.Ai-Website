"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Button, Card, CardBody, Input, IconButton, Textarea } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { Bars3Icon, XMarkIcon, PlusIcon, TrashIcon, PencilIcon, MinusIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton from '@/components/loading-skeleton';
import AppSidebar from '@/components/app-sidebar';

interface MindMap {
  id: string;
  title: string;
  structure: string;
  category?: string;
  colorScheme: string;
  createdAt: string;
  updatedAt: string;
}

interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  children: MindMapNode[];
}

interface MindMapStructure {
  centralTopic: string;
  branches: MindMapNode[];
}

export default function MindMapsPage() {
  const { user } = useUser();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [newMindMap, setNewMindMap] = useState({ title: '', category: '', colorScheme: 'default' });
  const [creatingStructure, setCreatingStructure] = useState<MindMapStructure>({
    centralTopic: '',
    branches: []
  });
  const [generateTopic, setGenerateTopic] = useState('');
  const [editingMindMap, setEditingMindMap] = useState<MindMap | null>(null);
  const [viewingMindMap, setViewingMindMap] = useState<MindMap | null>(null);
  const [editingStructure, setEditingStructure] = useState<MindMapStructure | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
      fetchMindMaps();
    }
  }, [user, selectedCategory]);

  const fetchMindMaps = async () => {
    try {
      setIsLoading(true);
      const url = `/api/mindmaps?userId=${user?.id}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      setMindMaps(data.mindMaps || []);
      
      const cats = [...new Set((data.mindMaps || []).map((m: any) => m.category).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching mind maps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMindMap = async () => {
    if (!generateTopic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/mindmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          generateFromTopic: true,
          topic: generateTopic.trim(),
          title: `Mind Map: ${generateTopic.trim()}`,
          category: 'AI Generated'
        })
      });

      const data = await response.json();
      if (data.success) {
        setGenerateTopic('');
        setShowGenerate(false);
        fetchMindMaps();
        alert('Mind map generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate mind map');
      }
    } catch (error: any) {
      console.error('Error generating mind map:', error);
      alert('Failed to generate mind map: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateMindMap = async () => {
    if (!newMindMap.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!creatingStructure.centralTopic.trim()) {
      alert('Please enter a central topic');
      return;
    }

    if (creatingStructure.branches.length === 0) {
      alert('Please add at least one branch');
      return;
    }

    // Validate that all branches have labels
    const branchesWithoutLabels = creatingStructure.branches.filter(b => !b.label.trim());
    if (branchesWithoutLabels.length > 0) {
      alert('Please fill in all branch labels');
      return;
    }

    try {
      // Filter out empty branches and ensure all have required fields
      const validBranches = creatingStructure.branches
        .filter(b => b.label.trim())
        .map(branch => ({
          ...branch,
          label: branch.label.trim(),
          children: branch.children.filter(child => child.label.trim()).map(child => ({
            ...child,
            label: child.label.trim()
          }))
        }));

      const structureToSave: MindMapStructure = {
        centralTopic: creatingStructure.centralTopic.trim(),
        branches: validBranches
      };

      const response = await fetch('/api/mindmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newMindMap.title.trim(),
          structure: structureToSave,
          category: newMindMap.category || 'General',
          colorScheme: newMindMap.colorScheme
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewMindMap({ title: '', category: '', colorScheme: 'default' });
        setCreatingStructure({ centralTopic: '', branches: [] });
        setShowCreate(false);
        fetchMindMaps();
        alert('Mind map created successfully!');
      } else {
        throw new Error(data.error || 'Failed to create mind map');
      }
    } catch (error: any) {
      console.error('Error creating mind map:', error);
      alert('Failed to create mind map: ' + (error.message || 'Unknown error'));
    }
  };

  const addBranch = () => {
    const newBranch: MindMapNode = {
      id: `branch-${Date.now()}`,
      label: '',
      description: '',
      color: '#3b82f6',
      children: []
    };
    setCreatingStructure({
      ...creatingStructure,
      branches: [...creatingStructure.branches, newBranch]
    });
  };

  const removeBranch = (branchId: string) => {
    setCreatingStructure({
      ...creatingStructure,
      branches: creatingStructure.branches.filter(b => b.id !== branchId)
    });
  };

  const updateBranch = (branchId: string, field: keyof MindMapNode, value: any) => {
    setCreatingStructure({
      ...creatingStructure,
      branches: creatingStructure.branches.map(branch =>
        branch.id === branchId ? { ...branch, [field]: value } : branch
      )
    });
  };

  const addSubBranch = (branchId: string) => {
    const newSubBranch: MindMapNode = {
      id: `sub-${Date.now()}`,
      label: '',
      description: '',
      color: '#3b82f6',
      children: []
    };
    setCreatingStructure({
      ...creatingStructure,
      branches: creatingStructure.branches.map(branch =>
        branch.id === branchId
          ? { ...branch, children: [...branch.children, newSubBranch] }
          : branch
      )
    });
  };

  const removeSubBranch = (branchId: string, subBranchId: string) => {
    setCreatingStructure({
      ...creatingStructure,
      branches: creatingStructure.branches.map(branch =>
        branch.id === branchId
          ? { ...branch, children: branch.children.filter(c => c.id !== subBranchId) }
          : branch
      )
    });
  };

  const updateSubBranch = (branchId: string, subBranchId: string, field: keyof MindMapNode, value: any) => {
    setCreatingStructure({
      ...creatingStructure,
      branches: creatingStructure.branches.map(branch =>
        branch.id === branchId
          ? {
              ...branch,
              children: branch.children.map(child =>
                child.id === subBranchId ? { ...child, [field]: value } : child
              )
            }
          : branch
      )
    });
  };

  const handleDeleteMindMap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mind map?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mindmaps?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchMindMaps();
        if (viewingMindMap?.id === id) {
          setViewingMindMap(null);
        }
        if (editingMindMap?.id === id) {
          setEditingMindMap(null);
          setEditingStructure(null);
        }
      }
    } catch (error) {
      console.error('Error deleting mind map:', error);
      alert('Failed to delete mind map');
    }
  };

  const renderMindMap = (mindMap: MindMap) => {
    try {
      const structure: MindMapStructure = typeof mindMap.structure === 'string'
        ? JSON.parse(mindMap.structure)
        : mindMap.structure;

      return (
        <div className="mind-map-container p-6 md:p-8 bg-gray-50 rounded-lg min-h-[500px] border border-gray-200">
          {/* Central Topic */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg md:text-xl shadow-lg text-center">
              {structure.centralTopic || mindMap.title}
            </div>
          </div>

          {/* Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structure.branches?.map((branch, idx) => (
              <div key={branch.id || idx} className="branch-container">
                <div
                  className="branch-main p-4 rounded-lg text-white font-semibold mb-3 shadow-md min-h-[80px] flex flex-col justify-center"
                  style={{ backgroundColor: branch.color || '#3b82f6' }}
                >
                  <div className="font-bold text-base md:text-lg mb-2">{branch.label}</div>
                  {branch.description && (
                    <div className="text-xs md:text-sm text-white/90 font-normal leading-relaxed">
                      {branch.description}
                    </div>
                  )}
                </div>
                {branch.children && branch.children.length > 0 && (
                  <div className="ml-4 space-y-2">
                    {branch.children.map((child, childIdx) => (
                      <div
                        key={child.id || childIdx}
                        className="branch-child p-3 rounded text-sm text-gray-700 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        style={{ borderLeft: `3px solid ${child.color || branch.color || '#3b82f6'}` }}
                      >
                        <div className="font-semibold text-gray-900 mb-1.5">{child.label}</div>
                        {child.description && (
                          <div className="text-xs text-gray-600 leading-relaxed">
                            {child.description}
                          </div>
                        )}
                        {child.children && child.children.length > 0 && (
                          <div className="ml-3 mt-2 space-y-1">
                            {child.children.map((subChild, subIdx) => (
                              <div
                                key={subChild.id || subIdx}
                                className="text-xs text-gray-600 pl-2 py-1"
                                style={{ borderLeft: `2px solid ${subChild.color || child.color || '#3b82f6'}` }}
                              >
                                <div className="font-medium text-gray-700">{subChild.label}</div>
                                {subChild.description && (
                                  <div className="text-gray-500 mt-0.5 leading-relaxed">
                                    {subChild.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering mind map:', error);
      return (
        <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-600 border border-gray-200">
          Error rendering mind map structure
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
        <Navbar />
        <LoadingSkeleton />
      </div>
    );
  }

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
                Mind Maps
              </Typography>
            </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowGenerate(true)}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                <i className="fa-solid fa-magic mr-2"></i>
                  Generate with AI
                </Button>
                <Button
                  onClick={() => setShowCreate(true)}
                className="bg-gray-900"
                >
                <i className="fa-solid fa-plus mr-2"></i>
                  Create New
                </Button>
              </div>
            </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-6 flex gap-2 flex-wrap">
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
            )}

            {/* Generate Modal */}
            {showGenerate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowGenerate(false)}>
                  <Card className="bg-white w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                      Generate Mind Map with AI
                    </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setShowGenerate(false);
                            setGenerateTopic('');
                          }}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>
                    <Input
                      label="Enter Topic"
                      value={generateTopic}
                      onChange={(e) => setGenerateTopic(e.target.value)}
                        className="mb-4"
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerateMindMap()}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateMindMap}
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

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => {
                  setShowCreate(false);
                  setNewMindMap({ title: '', category: '', colorScheme: 'default' });
                  setCreatingStructure({ centralTopic: '', branches: [] });
                }}>
                  <Card className="bg-white w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                      Create New Mind Map
                    </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setShowCreate(false);
                            setNewMindMap({ title: '', category: '', colorScheme: 'default' });
                            setCreatingStructure({ centralTopic: '', branches: [] });
                          }}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>

                      <div className="space-y-4">
                    <Input
                          label="Mind Map Title"
                      value={newMindMap.title}
                      onChange={(e) => setNewMindMap({ ...newMindMap, title: e.target.value })}
                          placeholder="e.g., Laws of Motion"
                          className="!border-gray-300 !pt-4"
                          labelProps={{
                            className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                          }}
                          containerProps={{
                            className: "!min-h-[56px]"
                          }}
                        />

                        <Input
                          label="Central Topic"
                          value={creatingStructure.centralTopic}
                          onChange={(e) => setCreatingStructure({ ...creatingStructure, centralTopic: e.target.value })}
                          placeholder="The main topic of your mind map"
                          className="!border-gray-300 !pt-4"
                          labelProps={{
                            className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                          }}
                          containerProps={{
                            className: "!min-h-[56px]"
                          }}
                        />

                    <Input
                      label="Category (optional)"
                      value={newMindMap.category}
                      onChange={(e) => setNewMindMap({ ...newMindMap, category: e.target.value })}
                          placeholder="e.g., Physics, Chemistry"
                          className="!border-gray-300 !pt-4"
                          labelProps={{
                            className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                          }}
                          containerProps={{
                            className: "!min-h-[56px]"
                          }}
                        />

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <Typography variant="h6" color="blue-gray" className="font-semibold">
                              Branches
                            </Typography>
                            <Button
                              size="sm"
                              onClick={addBranch}
                              className="bg-gray-900"
                            >
                              <PlusIcon className="w-4 h-4 mr-1" />
                              Add Branch
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {creatingStructure.branches.map((branch, idx) => (
                              <Card key={branch.id} className="border border-gray-200 overflow-hidden">
                                <CardBody className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <Typography variant="small" className="font-semibold text-gray-700">
                                      Branch {idx + 1}
                                    </Typography>
                                    <IconButton
                                      variant="text"
                                      size="sm"
                                      onClick={() => removeBranch(branch.id)}
                                      className="text-red-500 flex-shrink-0"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </IconButton>
                                  </div>

                                  <div className="space-y-3 overflow-visible">
                                    <Input
                                      label="Branch Label"
                                      value={branch.label}
                                      onChange={(e) => updateBranch(branch.id, 'label', e.target.value)}
                                      placeholder="e.g., Basics of Motion"
                                      className="!border-gray-300 !pt-4"
                                      size="md"
                                      labelProps={{
                                        className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                      }}
                                      containerProps={{
                                        className: "!min-h-[56px]"
                                      }}
                                    />

                                    <div className="relative">
                                      <Textarea
                                        label="Description (optional)"
                                        value={branch.description || ''}
                                        onChange={(e) => updateBranch(branch.id, 'description', e.target.value)}
                                        placeholder="Brief explanation of this branch"
                                        className="!border-gray-300 !min-h-[80px] !max-h-[150px] !overflow-y-auto !resize-y !pr-2 !pt-4"
                                        rows={3}
                                        labelProps={{
                                          className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                        }}
                                        style={{
                                          minHeight: '80px',
                                          maxHeight: '150px',
                                          overflowY: 'auto',
                                          resize: 'vertical',
                                          wordWrap: 'break-word',
                                          overflowWrap: 'break-word'
                                        }}
                                      />
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Typography variant="small" className="text-gray-600 w-20">
                                        Color:
                                      </Typography>
                                      <input
                                        type="color"
                                        value={branch.color || '#3b82f6'}
                                        onChange={(e) => updateBranch(branch.id, 'color', e.target.value)}
                                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                      />
                                    </div>

                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <Typography variant="small" className="font-semibold text-gray-600">
                                          Sub-branches
                                        </Typography>
                      <Button
                                          size="sm"
                                          variant="outlined"
                                          onClick={() => addSubBranch(branch.id)}
                                          className="text-xs"
                                        >
                                          <PlusIcon className="w-3 h-3 mr-1" />
                                          Add Sub-branch
                      </Button>
                                      </div>

                                      <div className="space-y-2 ml-4">
                                        {branch.children.map((subBranch, subIdx) => (
                                          <div key={subBranch.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200 overflow-hidden">
                                            <div className="flex-1 space-y-2 min-w-0 overflow-visible">
                                              <Input
                                                label={`Sub-branch ${subIdx + 1}`}
                                                value={subBranch.label}
                                                onChange={(e) => updateSubBranch(branch.id, subBranch.id, 'label', e.target.value)}
                                                placeholder="e.g., Definition"
                                                className="!border-gray-300 !pt-4"
                                                size="sm"
                                                labelProps={{
                                                  className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                                }}
                                                containerProps={{
                                                  className: "!min-h-[48px]"
                                                }}
                                              />
                                              <div className="relative">
                                                <Textarea
                                                  label="Description (optional)"
                                                  value={subBranch.description || ''}
                                                  onChange={(e) => updateSubBranch(branch.id, subBranch.id, 'description', e.target.value)}
                                                  placeholder="Brief explanation"
                                                  className="!border-gray-300 !min-h-[60px] !max-h-[120px] !overflow-y-auto !resize-y !pr-2 !pt-4"
                                                  rows={2}
                                                  labelProps={{
                                                    className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                                  }}
                                                  style={{
                                                    minHeight: '60px',
                                                    maxHeight: '120px',
                                                    overflowY: 'auto',
                                                    resize: 'vertical',
                                                    wordWrap: 'break-word',
                                                    overflowWrap: 'break-word'
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <IconButton
                                              variant="text"
                                              size="sm"
                                              onClick={() => removeSubBranch(branch.id, subBranch.id)}
                                              className="text-red-500 mt-1 flex-shrink-0"
                                            >
                                              <MinusIcon className="w-4 h-4" />
                                            </IconButton>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            ))}

                            {creatingStructure.branches.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <Typography variant="small">
                                  No branches yet. Click "Add Branch" to get started.
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          setShowCreate(false);
                          setNewMindMap({ title: '', category: '', colorScheme: 'default' });
                            setCreatingStructure({ centralTopic: '', branches: [] });
                        }}
                          variant="outlined"
                      >
                        Cancel
                      </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCreateMindMap();
                          }}
                          className="bg-gray-900"
                          disabled={!newMindMap.title.trim() || !creatingStructure.centralTopic.trim() || creatingStructure.branches.length === 0 || creatingStructure.branches.some(b => !b.label.trim())}
                        >
                          Create Mind Map
                        </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Mind Maps List */}
            {mindMaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-diagram-project text-4xl text-gray-400"></i>
                  </div>
                  <Typography variant="h5" color="gray" className="mb-2 font-semibold">
                  No mind maps yet
                </Typography>
                  <Typography color="gray" className="mb-6 text-center max-w-md">
                  Create or generate a mind map to get started!
                </Typography>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowCreate(true)} className="bg-gray-900">
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create New
                    </Button>
                    <Button onClick={() => setShowGenerate(true)} variant="outlined" className="border-gray-900 text-gray-900">
                      <i className="fa-solid fa-magic mr-2"></i>
                      Generate with AI
                    </Button>
                  </div>
                </div>
            ) : (
              <div className="space-y-6">
                {mindMaps.map((mindMap) => (
                    <Card key={mindMap.id} className="hover:shadow-lg transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold mb-1">
                            {mindMap.title}
                          </Typography>
                          {mindMap.category && (
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {mindMap.category}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <IconButton
                              variant="text"
                              size="sm"
                            onClick={() => {
                              const structure = typeof mindMap.structure === 'string' 
                                ? JSON.parse(mindMap.structure) 
                                : mindMap.structure;
                              setViewingMindMap(mindMap);
                            }}
                            title="View Mind Map"
                          >
                            <i className="fa-solid fa-eye text-green-500"></i>
                          </IconButton>
                          <IconButton
                              variant="text"
                              size="sm"
                            onClick={() => {
                              const structure = typeof mindMap.structure === 'string' 
                                ? JSON.parse(mindMap.structure) 
                                : mindMap.structure;
                              setEditingMindMap(mindMap);
                              setEditingStructure(structure);
                            }}
                            title="Edit Mind Map"
                          >
                            <PencilIcon className="w-4 h-4 text-blue-500" />
                          </IconButton>
                          <IconButton
                              variant="text"
                              size="sm"
                            onClick={() => handleDeleteMindMap(mindMap.id)}
                            title="Delete Mind Map"
                          >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                          </IconButton>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}

            {/* View Mind Map Modal */}
            {viewingMindMap && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => setViewingMindMap(null)}
                style={{ maxHeight: '100vh', overflow: 'auto' }}
              >
                <Card 
                  className="bg-white w-full max-w-6xl my-4" 
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
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex-1">
                        <Typography variant="h4" className="font-bold mb-2">
                          {viewingMindMap.title}
                        </Typography>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {viewingMindMap.category && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full">
                              {viewingMindMap.category}
                            </span>
                          )}
                          <span>
                            {new Date(viewingMindMap.createdAt).toLocaleDateString('en-US', {
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
                            const structure = typeof viewingMindMap.structure === 'string' 
                              ? JSON.parse(viewingMindMap.structure) 
                              : viewingMindMap.structure;
                            setViewingMindMap(null);
                            setEditingMindMap(viewingMindMap);
                            setEditingStructure(structure);
                          }}
                          className="border-gray-900 text-gray-900"
                        >
                          <i className="fa-solid fa-edit mr-2"></i>
                          Edit
                        </Button>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => setViewingMindMap(null)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </IconButton>
                      </div>
                    </div>
                    
                    {/* Mind Map Content - Scrollable */}
                    <div 
                      className="flex-1 overflow-y-auto"
                      style={{ 
                        minHeight: 0,
                        maxHeight: 'calc(100vh - 200px)'
                      }}
                    >
                      {renderMindMap(viewingMindMap)}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Edit Mind Map Modal */}
            {editingMindMap && editingStructure && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" 
                onClick={() => {
                  setEditingMindMap(null);
                  setEditingStructure(null);
                }}
              >
                <Card 
                  className="bg-white w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Edit Mind Map
                      </Typography>
                      <IconButton
                        variant="text"
                        size="sm"
                        onClick={() => {
                          setEditingMindMap(null);
                          setEditingStructure(null);
                        }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </IconButton>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Mind Map Title"
                        value={editingMindMap.title}
                        onChange={(e) => setEditingMindMap({ ...editingMindMap, title: e.target.value })}
                        placeholder="e.g., Laws of Motion"
                        className="!border-gray-300 !pt-4"
                        labelProps={{
                          className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                        }}
                        containerProps={{
                          className: "!min-h-[56px]"
                        }}
                      />

                      <Input
                        label="Central Topic"
                        value={editingStructure.centralTopic}
                        onChange={(e) => setEditingStructure({ ...editingStructure, centralTopic: e.target.value })}
                        placeholder="The main topic of your mind map"
                        className="!border-gray-300 !pt-4"
                        labelProps={{
                          className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                        }}
                        containerProps={{
                          className: "!min-h-[56px]"
                        }}
                      />

                      <Input
                        label="Category (optional)"
                        value={editingMindMap.category || ''}
                        onChange={(e) => setEditingMindMap({ ...editingMindMap, category: e.target.value })}
                        placeholder="e.g., Physics, Chemistry"
                        className="!border-gray-300 !pt-4"
                        labelProps={{
                          className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                        }}
                        containerProps={{
                          className: "!min-h-[56px]"
                        }}
                      />

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <Typography variant="h6" color="blue-gray" className="font-semibold">
                            Branches
                          </Typography>
                          <Button
                            size="sm"
                            onClick={() => {
                              const newBranch: MindMapNode = {
                                id: `branch-${Date.now()}`,
                                label: '',
                                description: '',
                                color: '#3b82f6',
                                children: []
                              };
                              setEditingStructure({
                                ...editingStructure,
                                branches: [...editingStructure.branches, newBranch]
                              });
                            }}
                            className="bg-gray-900"
                          >
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Add Branch
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {editingStructure.branches.map((branch, idx) => (
                            <Card key={branch.id} className="border border-gray-200 overflow-hidden">
                              <CardBody className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <Typography variant="small" className="font-semibold text-gray-700">
                                    Branch {idx + 1}
                                  </Typography>
                                  <IconButton
                                    variant="text"
                                    size="sm"
                                    onClick={() => {
                                      setEditingStructure({
                                        ...editingStructure,
                                        branches: editingStructure.branches.filter(b => b.id !== branch.id)
                                      });
                                    }}
                                    className="text-red-500 flex-shrink-0"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </IconButton>
                                </div>

                                <div className="space-y-3 overflow-visible">
                                  <Input
                                    label="Branch Label"
                                    value={branch.label}
                                    onChange={(e) => {
                                      const updatedBranches = editingStructure.branches.map(b =>
                                        b.id === branch.id ? { ...b, label: e.target.value } : b
                                      );
                                      setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                    }}
                                    placeholder="e.g., Basics of Motion"
                                    className="!border-gray-300 !pt-4"
                                    size="md"
                                    labelProps={{
                                      className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                    }}
                                    containerProps={{
                                      className: "!min-h-[56px]"
                                    }}
                                  />

                                  <div className="relative">
                                    <Textarea
                                      label="Description (optional)"
                                      value={branch.description || ''}
                                      onChange={(e) => {
                                        const updatedBranches = editingStructure.branches.map(b =>
                                          b.id === branch.id ? { ...b, description: e.target.value } : b
                                        );
                                        setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                      }}
                                      placeholder="Brief explanation of this branch"
                                      className="!border-gray-300 !min-h-[80px] !max-h-[150px] !overflow-y-auto !resize-y !pr-2 !pt-4"
                                      rows={3}
                                      labelProps={{
                                        className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                      }}
                                      style={{
                                        minHeight: '80px',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        resize: 'vertical',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word'
                                      }}
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Typography variant="small" className="text-gray-600 w-20">
                                      Color:
                                    </Typography>
                                    <input
                                      type="color"
                                      value={branch.color || '#3b82f6'}
                                      onChange={(e) => {
                                        const updatedBranches = editingStructure.branches.map(b =>
                                          b.id === branch.id ? { ...b, color: e.target.value } : b
                                        );
                                        setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                      }}
                                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                    />
                                  </div>

                                  <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <Typography variant="small" className="font-semibold text-gray-600">
                                        Sub-branches
                                      </Typography>
                                      <Button
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => {
                                          const newSubBranch: MindMapNode = {
                                            id: `sub-${Date.now()}`,
                                            label: '',
                                            description: '',
                                            color: '#3b82f6',
                                            children: []
                                          };
                                          const updatedBranches = editingStructure.branches.map(b =>
                                            b.id === branch.id 
                                              ? { ...b, children: [...b.children, newSubBranch] }
                                              : b
                                          );
                                          setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                        }}
                                        className="text-xs"
                                      >
                                        <PlusIcon className="w-3 h-3 mr-1" />
                                        Add Sub-branch
                                      </Button>
                                    </div>

                                    <div className="space-y-2 ml-4">
                                      {branch.children.map((subBranch, subIdx) => (
                                        <div key={subBranch.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200 overflow-hidden">
                                          <div className="flex-1 space-y-2 min-w-0 overflow-visible">
                                            <Input
                                              label={`Sub-branch ${subIdx + 1}`}
                                              value={subBranch.label}
                                              onChange={(e) => {
                                                const updatedBranches = editingStructure.branches.map(b =>
                                                  b.id === branch.id
                                                    ? {
                                                        ...b,
                                                        children: b.children.map(c =>
                                                          c.id === subBranch.id ? { ...c, label: e.target.value } : c
                                                        )
                                                      }
                                                    : b
                                                );
                                                setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                              }}
                                              placeholder="e.g., Definition"
                                              className="!border-gray-300 !pt-4"
                                              size="sm"
                                              labelProps={{
                                                className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                              }}
                                              containerProps={{
                                                className: "!min-h-[48px]"
                                              }}
                                            />
                                            <div className="relative">
                                              <Textarea
                                                label="Description (optional)"
                                                value={subBranch.description || ''}
                                                onChange={(e) => {
                                                  const updatedBranches = editingStructure.branches.map(b =>
                                                    b.id === branch.id
                                                      ? {
                                                          ...b,
                                                          children: b.children.map(c =>
                                                            c.id === subBranch.id ? { ...c, description: e.target.value } : c
                                                          )
                                                        }
                                                      : b
                                                  );
                                                  setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                                }}
                                                placeholder="Brief explanation"
                                                className="!border-gray-300 !min-h-[60px] !max-h-[120px] !overflow-y-auto !resize-y !pr-2 !pt-4"
                                                rows={2}
                                                labelProps={{
                                                  className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500"
                                                }}
                                                style={{
                                                  minHeight: '60px',
                                                  maxHeight: '120px',
                                                  overflowY: 'auto',
                                                  resize: 'vertical',
                                                  wordWrap: 'break-word',
                                                  overflowWrap: 'break-word'
                                                }}
                                              />
                                            </div>
                                            {/* Sub-sub-branches support */}
                                            {subBranch.children && subBranch.children.length > 0 && (
                                              <div className="border-t border-gray-200 pt-2 mt-2">
                                                <div className="flex items-center justify-between mb-2">
                                                  <Typography variant="small" className="font-semibold text-gray-600 text-xs">
                                                    Sub-sub-branches
                                                  </Typography>
                                                  <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    onClick={() => {
                                                      const newSubSubBranch: MindMapNode = {
                                                        id: `subsub-${Date.now()}`,
                                                        label: '',
                                                        description: '',
                                                        color: '#3b82f6',
                                                        children: []
                                                      };
                                                      const updatedBranches = editingStructure.branches.map(b =>
                                                        b.id === branch.id
                                                          ? {
                                                              ...b,
                                                              children: b.children.map(c =>
                                                                c.id === subBranch.id
                                                                  ? { ...c, children: [...c.children, newSubSubBranch] }
                                                                  : c
                                                              )
                                                            }
                                                          : b
                                                      );
                                                      setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                                    }}
                                                    className="text-xs"
                                                  >
                                                    <PlusIcon className="w-3 h-3 mr-1" />
                                                    Add
                                                  </Button>
                                                </div>
                                                <div className="space-y-1 ml-2">
                                                  {subBranch.children.map((subSubBranch, subSubIdx) => (
                                                    <div key={subSubBranch.id} className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                                                      <Input
                                                        value={subSubBranch.label}
                                                        onChange={(e) => {
                                                          const updatedBranches = editingStructure.branches.map(b =>
                                                            b.id === branch.id
                                                              ? {
                                                                  ...b,
                                                                  children: b.children.map(c =>
                                                                    c.id === subBranch.id
                                                                      ? {
                                                                          ...c,
                                                                          children: c.children.map(ss =>
                                                                            ss.id === subSubBranch.id ? { ...ss, label: e.target.value } : ss
                                                                          )
                                                                        }
                                                                      : c
                                                                  )
                                                                }
                                                              : b
                                                          );
                                                          setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                                        }}
                                                        placeholder="Sub-sub-branch"
                                                        className="!border-gray-300 text-xs"
                                                        size="sm"
                                                      />
                                                      <IconButton
                                                        variant="text"
                                                        size="sm"
                                                        onClick={() => {
                                                          const updatedBranches = editingStructure.branches.map(b =>
                                                            b.id === branch.id
                                                              ? {
                                                                  ...b,
                                                                  children: b.children.map(c =>
                                                                    c.id === subBranch.id
                                                                      ? { ...c, children: c.children.filter(ss => ss.id !== subSubBranch.id) }
                                                                      : c
                                                                  )
                                                                }
                                                              : b
                                                          );
                                                          setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                                        }}
                                                        className="text-red-500"
                                                      >
                                                        <MinusIcon className="w-3 h-3" />
                                                      </IconButton>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <IconButton
                                            variant="text"
                                            size="sm"
                                            onClick={() => {
                                              const updatedBranches = editingStructure.branches.map(b =>
                                                b.id === branch.id
                                                  ? { ...b, children: b.children.filter(c => c.id !== subBranch.id) }
                                                  : b
                                              );
                                              setEditingStructure({ ...editingStructure, branches: updatedBranches });
                                            }}
                                            className="text-red-500 mt-1 flex-shrink-0"
                                          >
                                            <MinusIcon className="w-4 h-4" />
                                          </IconButton>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}

                          {editingStructure.branches.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Typography variant="small">
                                No branches yet. Click "Add Branch" to get started.
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          setEditingMindMap(null);
                          setEditingStructure(null);
                        }}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!editingMindMap || !editingStructure) return;
                          
                          // Validate
                          if (!editingMindMap.title.trim()) {
                            alert('Please enter a title');
                            return;
                          }
                          if (!editingStructure.centralTopic.trim()) {
                            alert('Please enter a central topic');
                            return;
                          }
                          if (editingStructure.branches.length === 0) {
                            alert('Please add at least one branch');
                            return;
                          }
                          const branchesWithoutLabels = editingStructure.branches.filter(b => !b.label.trim());
                          if (branchesWithoutLabels.length > 0) {
                            alert('Please fill in all branch labels');
                            return;
                          }

                          try {
                            const validBranches = editingStructure.branches
                              .filter(b => b.label.trim())
                              .map(branch => ({
                                ...branch,
                                label: branch.label.trim(),
                                children: branch.children.filter(child => child.label.trim()).map(child => ({
                                  ...child,
                                  label: child.label.trim(),
                                  children: child.children ? child.children.filter(subChild => subChild.label.trim()).map(subChild => ({
                                    ...subChild,
                                    label: subChild.label.trim()
                                  })) : []
                                }))
                              }));

                            const structureToSave: MindMapStructure = {
                              centralTopic: editingStructure.centralTopic.trim(),
                              branches: validBranches
                            };

                            const response = await fetch('/api/mindmaps', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                id: editingMindMap.id,
                                title: editingMindMap.title.trim(),
                                structure: structureToSave,
                                category: editingMindMap.category || 'General',
                                colorScheme: editingMindMap.colorScheme || 'default'
                              })
                            });

                            const data = await response.json();
                            if (data.success) {
                              setEditingMindMap(null);
                              setEditingStructure(null);
                              fetchMindMaps();
                              alert('Mind map updated successfully!');
                            } else {
                              throw new Error(data.error || 'Failed to update mind map');
                            }
                          } catch (error: any) {
                            console.error('Error updating mind map:', error);
                            alert('Failed to update mind map: ' + (error.message || 'Unknown error'));
                          }
                        }}
                        className="bg-gray-900"
                        disabled={!editingMindMap.title.trim() || !editingStructure.centralTopic.trim() || editingStructure.branches.length === 0 || editingStructure.branches.some(b => !b.label.trim())}
                      >
                        Update Mind Map
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
