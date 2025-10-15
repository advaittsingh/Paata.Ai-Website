"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Button, Card, CardBody, Input } from "@material-tailwind/react";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Subject {
  name: string;
  description: string;
  icon: string;
  color: string;
  bookCount: number;
  folder: string;
}

export default function ClassPage() {
  const params = useParams();
  const classNumber = params.class as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Define subjects for each class
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

  useEffect(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setSubjects(classSubjects[classNumber] || []);
      setLoading(false);
    }, 500);
  }, [classNumber]);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
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
    // Show subject information or redirect to help
    alert(`Subject: ${subject.name}\nDescription: ${subject.description}\n\nThis subject is part of Class ${classNumber} curriculum. For more information, please contact our support team.`);
  };

  const handleAISearch = () => {
    if (searchQuery.trim()) {
      // Show AI search information
      alert(`AI Search for "${searchQuery}" in Class ${classNumber}\n\nOur AI-powered search feature is currently being updated. For now, please contact our support team for assistance with specific topics.`);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        <div className="grid !min-h-[40rem] sm:!min-h-[49rem] bg-gray-900 px-4 sm:px-8">
          <div className="container mx-auto mt-20 sm:mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
            <div className="col-span-1">
              <Typography variant="h1" color="white" className="mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                Class {classNumber} <br /> Study Materials
              </Typography>
              <Typography
                variant="lead"
                className="mb-7 !text-white text-sm sm:text-base md:pr-16 xl:pr-28"
              >
                Comprehensive study materials and resources for Class {classNumber} students. 
                Access subject-wise information and AI-powered learning support.
              </Typography>
              <div className="flex flex-col gap-2 w-full sm:w-auto md:mb-2 md:w-10/12 md:flex-row">
                <Button
                  size="lg"
                  color="white"
                  className="flex justify-center items-center gap-3"
                  onClick={() => document.getElementById('subjects-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fa-solid fa-book-open"></i>
                  Browse Subjects
                </Button>
                <Button
                  size="lg"
                  variant="outlined"
                  color="white"
                  className="flex justify-center items-center gap-3"
                  onClick={() => window.location.href = '/documentation'}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  Back to Docs
                </Button>
              </div>
            </div>
            <div className="col-span-1 my-10 sm:my-20 h-full max-h-[25rem] sm:max-h-[30rem] -translate-y-16 sm:-translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#612A74] rounded-2xl sm:rounded-3xl transform rotate-3 sm:rotate-6"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    📚 {subjects.length} Subjects Available
                  </Typography>
                  <Typography color="gray" className="mb-4">
                  Complete curriculum coverage with {subjects.length} subjects 
                  and study materials for Class {classNumber}.
                  </Typography>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-graduation-cap text-xl text-[#612A74]"></i>
                    </div>
                    <Typography color="blue-gray" className="font-medium">
                      Complete Learning Package
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  🤖 AI-Powered Search for Class {classNumber}
                </Typography>
                <Typography color="gray">
                  Ask for any topic and get relevant PDFs instantly from Class {classNumber} materials
                </Typography>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label={`Search Class ${classNumber} topics (e.g., 'algebra', 'photosynthesis', 'Shakespeare')`}
                    placeholder="What would you like to learn about?"
                    className="text-lg"
                    icon={<i className="fa-solid fa-robot"></i>}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAISearch();
                      }
                    }}
                  />
                </div>
                <Button
                  style={{backgroundColor: '#612A74'}}
                  size="lg"
                  className="px-8"
                  onClick={handleAISearch}
                  disabled={!searchQuery.trim()}
                >
                  <i className="fa-solid fa-search mr-2"></i>
                  AI Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects-section" className="py-16 sm:py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase text-sm sm:text-base">
              Class {classNumber} Subjects
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4 text-2xl sm:text-3xl lg:text-4xl">
              Available Study Materials
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto text-sm sm:text-base">
              Click on any subject to learn more about the curriculum
            </Typography>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#612A74] mx-auto mb-4"></div>
              <Typography color="gray">Loading subjects...</Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredSubjects.map((subject, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => handleViewSubject(subject)}>
                  <CardBody className="p-4 sm:p-6 lg:p-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getColorClasses(subject.color)} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                      <i className={`fa-solid ${subject.icon} text-lg sm:text-2xl`}></i>
                    </div>
                    <Typography variant="h4" color="blue-gray" className="mb-3 sm:mb-4 text-lg sm:text-xl">
                      {subject.name}
                    </Typography>
                    <Typography color="gray" className="mb-4 sm:mb-6 text-sm sm:text-base">
                      {subject.description}
                    </Typography>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <Typography color="gray" className="text-xs sm:text-sm">
                        Curriculum Subject
                      </Typography>
                      <Typography color="gray" className="text-xs sm:text-sm">
                        Available
                      </Typography>
                    </div>
                    <Button
                      style={{backgroundColor: '#612A74'}}
                      size="lg"
                      className="w-full text-sm sm:text-base"
                    >
                      <i className="fa-solid fa-info-circle mr-2"></i>
                      Learn More
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {filteredSubjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fa-solid fa-search text-6xl"></i>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-2">
                No subjects found
              </Typography>
              <Typography color="gray" className="mb-6">
                Try adjusting your search criteria or browse all subjects
              </Typography>
              <Button
                style={{backgroundColor: '#612A74'}}
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="mb-4 text-xl sm:text-2xl lg:text-3xl">
              Need Help Finding Specific Materials?
            </Typography>
            <Typography color="gray" className="mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Use our AI-powered search to find exactly what you need from Class {classNumber} materials.
            </Typography>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                 variant="outlined"
                 style={{borderColor: '#612A74', color: '#612A74'}}
                 size="lg"
                 className="w-full sm:w-auto"
                 onClick={() => window.location.href = '/help'}
               >
                 <i className="fa-solid fa-question-circle mr-2"></i>
                 Get Help
               </Button>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
