"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Card, CardBody, Button, Input, IconButton } from "@material-tailwind/react";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getChaptersForSubject, Chapter } from '@/data/chapterData';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const classNumber = params.class as string;
  const subjectName = params.subject as string;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    
    // Get chapters for this subject and class
    const subjectChapters = getChaptersForSubject(subjectName, classNumber);
    setChapters(subjectChapters);
    
    setLoading(false);
  }, [user, classNumber, subjectName, router]);

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      mathematics: 'blue',
      science: 'green',
      english: 'purple',
      hindi: 'orange',
      physics: 'indigo',
      chemistry: 'teal',
      biology: 'emerald',
      'social studies': 'rose',
      'computer science': 'violet'
    };
    return colorMap[subject.toLowerCase()] || 'gray';
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      rose: 'bg-rose-100 text-rose-600 border-rose-200',
      violet: 'bg-violet-100 text-violet-600 border-violet-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const subjectColor = getSubjectColor(subjectName);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Typography variant="h3" className="mb-4">
                Please Login to Access Study Materials
              </Typography>
              <Button
                onClick={() => router.push('/auth/login')}
                className="bg-gray-900"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <IconButton
                variant="text"
                onClick={() => router.push('/learning')}
                className="text-gray-900"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </IconButton>
              <div>
                <Typography variant="h2" className="mb-2 capitalize">
                  {subjectName}
                </Typography>
                <Typography variant="lead" color="gray">
                  Class {classNumber} - All Chapters
                </Typography>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mb-8">
            <Input
              label="Search chapters..."
              icon={<i className="fa-solid fa-search"></i>}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <Typography color="gray">Loading chapters...</Typography>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-12">
              <Typography variant="h5" className="mb-2">
                No chapters found
              </Typography>
              <Typography color="gray" className="mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Chapters will be available soon'}
              </Typography>
              <Button
                onClick={() => router.push('/learning')}
                variant="outlined"
                className="border-gray-900 text-gray-900"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back to Subjects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                  onClick={() => router.push(`/learning/${classNumber}/${subjectName}/${chapter.id}`)}
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${getColorClasses(subjectColor)} rounded-lg flex items-center justify-center border-2`}>
                        <Typography variant="h6" className="font-bold">
                          {chapter.number}
                        </Typography>
                      </div>
                      <div className="flex gap-2 text-sm text-gray-600">
                        {chapter.videos.length > 0 && (
                          <span><i className="fa-solid fa-video mr-1"></i>{chapter.videos.length}</span>
                        )}
                        {chapter.pdfs.length > 0 && (
                          <span><i className="fa-solid fa-file-pdf mr-1"></i>{chapter.pdfs.length}</span>
                        )}
                      </div>
                    </div>
                    <Typography variant="h5" className="mb-2">
                      {chapter.title}
                    </Typography>
                    <Typography color="gray" className="mb-4 text-sm">
                      {chapter.description}
                    </Typography>
                    {chapter.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {chapter.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                        {chapter.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{chapter.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <Button
                      size="sm"
                      className={`w-full ${
                        subjectColor === 'blue' ? 'bg-blue-600' : 
                        subjectColor === 'green' ? 'bg-green-600' :
                        subjectColor === 'purple' ? 'bg-purple-600' :
                        subjectColor === 'orange' ? 'bg-orange-600' :
                        subjectColor === 'indigo' ? 'bg-indigo-600' :
                        subjectColor === 'teal' ? 'bg-teal-600' :
                        subjectColor === 'emerald' ? 'bg-emerald-600' :
                        subjectColor === 'rose' ? 'bg-rose-600' :
                        subjectColor === 'violet' ? 'bg-violet-600' :
                        'bg-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/learning/${classNumber}/${subjectName}/${chapter.id}`);
                      }}
                    >
                      <i className="fa-solid fa-book-open mr-2"></i>
                      Open Chapter
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

