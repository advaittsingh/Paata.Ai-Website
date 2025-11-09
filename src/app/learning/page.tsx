"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Card, CardBody, Button, Input } from "@material-tailwind/react";
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Subject {
  name: string;
  description: string;
  icon: string;
  color: string;
  bookCount: number;
  folder: string;
}

// Define subjects for each class (same as class page)
const classSubjects: { [key: string]: Subject[] } = {
  '1': [
    { name: 'Mathematics', description: 'Basic numbers, shapes, and counting', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Nature, environment, and basic concepts', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Alphabet, words, and basic reading', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi alphabet and basic language', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '2': [
    { name: 'Mathematics', description: 'Addition, subtraction, and basic operations', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Plants, animals, and natural phenomena', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Reading comprehension and grammar', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi reading and writing skills', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '3': [
    { name: 'Mathematics', description: 'Multiplication, division, and fractions', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Human body, weather, and materials', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Advanced grammar and composition', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and poetry', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '4': [
    { name: 'Mathematics', description: 'Decimals, geometry, and measurements', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Force, energy, and simple machines', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Creative writing and literature', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Advanced Hindi grammar and stories', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '5': [
    { name: 'Mathematics', description: 'Algebra basics and advanced geometry', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Matter, energy, and chemical changes', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Advanced literature and critical thinking', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi poetry and advanced literature', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '6': [
    { name: 'Mathematics', description: 'Algebra, geometry, and statistics', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Science', description: 'Physics, chemistry, and biology basics', icon: 'fa-flask', color: 'green', bookCount: 15, folder: 'jesc1dd' },
    { name: 'English', description: 'Literature analysis and writing skills', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi grammar and literature', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' },
    { name: 'Social Studies', description: 'History, geography, and civics', icon: 'fa-globe', color: 'indigo', bookCount: 20, folder: 'keww1dd' },
    { name: 'Computer Science', description: 'Basic programming and computer concepts', icon: 'fa-laptop', color: 'teal', bookCount: 15, folder: 'lekl1dd' }
  ],
  '7': [
    { name: 'Mathematics', description: 'Advanced algebra and geometry', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Motion, force, and energy', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Elements, compounds, and reactions', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Cell biology and life processes', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Advanced literature and composition', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and advanced grammar', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '8': [
    { name: 'Mathematics', description: 'Trigonometry and advanced geometry', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Light, sound, and electricity', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Acids, bases, and chemical bonding', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Reproduction and genetics', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Literature and advanced writing', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi poetry and prose', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' }
  ],
  '9': [
    { name: 'Mathematics', description: 'Coordinate geometry and statistics', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Mechanics and thermodynamics', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Atomic structure and periodic table', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Cell division and evolution', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Literature and critical analysis', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and grammar', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' },
    { name: 'Social Studies', description: 'History and political science', icon: 'fa-globe', color: 'rose', bookCount: 30, folder: 'keww1dd' },
    { name: 'Computer Science', description: 'Programming and algorithms', icon: 'fa-laptop', color: 'violet', bookCount: 23, folder: 'lekl1dd' }
  ],
  '10': [
    { name: 'Mathematics', description: 'Trigonometry and probability', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Optics and modern physics', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Organic and inorganic chemistry', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Ecology and biotechnology', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Literature and board preparation', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and board prep', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' },
    { name: 'Social Studies', description: 'History and geography', icon: 'fa-globe', color: 'rose', bookCount: 30, folder: 'keww1dd' },
    { name: 'Computer Science', description: 'Advanced programming', icon: 'fa-laptop', color: 'violet', bookCount: 23, folder: 'lekl1dd' }
  ],
  '11': [
    { name: 'Mathematics', description: 'Calculus and advanced algebra', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Mechanics and waves', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Physical and organic chemistry', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Botany and zoology', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Literature and communication', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and grammar', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' },
    { name: 'Economics', description: 'Micro and macro economics', icon: 'fa-chart-line', color: 'amber', bookCount: 15, folder: 'lekl1dd' },
    { name: 'Accountancy', description: 'Financial accounting', icon: 'fa-calculator', color: 'green', bookCount: 12, folder: 'lekl1dd' },
    { name: 'Business Studies', description: 'Business management', icon: 'fa-briefcase', color: 'blue', bookCount: 18, folder: 'lekl1dd' },
    { name: 'Computer Science', description: 'Programming and databases', icon: 'fa-laptop', color: 'violet', bookCount: 23, folder: 'lekl1dd' }
  ],
  '12': [
    { name: 'Mathematics', description: 'Advanced calculus and statistics', icon: 'fa-calculator', color: 'blue', bookCount: 19, folder: 'jemh1dd' },
    { name: 'Physics', description: 'Modern physics and electronics', icon: 'fa-atom', color: 'indigo', bookCount: 10, folder: 'keph1dd' },
    { name: 'Chemistry', description: 'Advanced organic chemistry', icon: 'fa-vial', color: 'teal', bookCount: 9, folder: 'kech1dd' },
    { name: 'Biology', description: 'Advanced botany and zoology', icon: 'fa-dna', color: 'emerald', bookCount: 20, folder: 'kebo1dd' },
    { name: 'English', description: 'Literature and competitive prep', icon: 'fa-book', color: 'purple', bookCount: 10, folder: 'jeff1dd' },
    { name: 'Hindi', description: 'Hindi literature and competitive prep', icon: 'fa-language', color: 'orange', bookCount: 10, folder: 'jefp1dd' },
    { name: 'Economics', description: 'Advanced economics', icon: 'fa-chart-line', color: 'amber', bookCount: 15, folder: 'lekl1dd' },
    { name: 'Accountancy', description: 'Advanced accounting', icon: 'fa-calculator', color: 'green', bookCount: 12, folder: 'lekl1dd' },
    { name: 'Business Studies', description: 'Advanced business management', icon: 'fa-briefcase', color: 'blue', bookCount: 18, folder: 'lekl1dd' },
    { name: 'Computer Science', description: 'Advanced programming and AI', icon: 'fa-laptop', color: 'violet', bookCount: 23, folder: 'lekl1dd' }
  ]
};

export default function DocsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user's class and board from preferences
  const userClass = user?.preferences?.learning?.class || '1';
  const userBoard = user?.preferences?.learning?.board || 'CBSE';

  useEffect(() => {
    if (!user) {
      // If not logged in, redirect to login or show message
      return;
    }

    setLoading(true);
    
    // Get subjects for user's class
    const classSubs = classSubjects[userClass] || [];
    setSubjects(classSubs);

    setLoading(false);
  }, [user, userClass]);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-gray-100 text-gray-900',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      teal: 'bg-teal-100 text-teal-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      rose: 'bg-rose-100 text-rose-600',
      amber: 'bg-amber-100 text-amber-600',
      violet: 'bg-violet-100 text-violet-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const handleViewSubject = (subject: Subject) => {
    router.push(`/learning/${userClass}/${subject.name.toLowerCase()}`);
  };


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
              <Typography color="gray" className="mb-6">
                You need to be logged in to view your personalized study materials.
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
          <div className="text-center mb-8">
            <Typography variant="h2" className="mb-4">
              Learning Materials
            </Typography>
            <Typography variant="lead" color="gray" className="mb-2">
              Class {userClass} - {userBoard} Board
            </Typography>
            <Typography color="gray" className="text-sm">
              Personalized content based on your class and board selection
            </Typography>
            <Button
              variant="text"
              onClick={() => router.push('/profile')}
              className="mt-4 text-gray-900"
            >
              <i className="fa-solid fa-edit mr-2"></i>
              Change Class/Board
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <Input
              label="Search subjects, videos, or books..."
              icon={<i className="fa-solid fa-search"></i>}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <Typography color="gray">Loading study materials...</Typography>
            </div>
          ) : (
            <>
              {/* Subjects Section */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <Typography variant="h4" className="font-bold">
                    Subjects ({filteredSubjects.length})
                  </Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubjects.map((subject, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewSubject(subject)}>
                      <CardBody className="p-6">
                        <div className={`w-16 h-16 ${getColorClasses(subject.color)} rounded-xl flex items-center justify-center mb-4`}>
                          <i className={`fa-solid ${subject.icon} text-2xl`}></i>
                        </div>
                        <Typography variant="h5" className="mb-2">
                          {subject.name}
                        </Typography>
                        <Typography color="gray" className="mb-4 text-sm">
                          {subject.description}
                        </Typography>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span><i className="fa-solid fa-book mr-1"></i>{subject.bookCount} Books</span>
                          <span><i className="fa-solid fa-video mr-1"></i>Videos</span>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </section>

              {filteredSubjects.length === 0 && (
                <div className="text-center py-12">
                  <Typography variant="h5" className="mb-2">
                    No materials found
                  </Typography>
                  <Typography color="gray" className="mb-6">
                    Try adjusting your search or update your class/board in profile settings
                  </Typography>
                  <Button
                    onClick={() => router.push('/profile')}
                    className="bg-gray-900"
                  >
                    Update Profile
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
