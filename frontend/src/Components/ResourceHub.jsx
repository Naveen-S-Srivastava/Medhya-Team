import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { BookOpen, Play, Headphones, Download, Search, Filter, Star, Clock, Eye } from 'lucide-react';

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const resources = [
    {
      id: '1',
      title: 'Understanding Anxiety: A Student\'s Guide',
      description: 'Comprehensive guide to recognizing and managing anxiety symptoms in college life.',
      type: 'guide',
      category: 'anxiety',
      language: 'english',
      duration: '15 min read',
      rating: 4.8,
      views: 1247,
      featured: true
    },
    {
      id: '2',
      title: 'Breathing Exercises for Panic Attacks',
      description: 'Step-by-step audio guide for managing panic attacks using breathing techniques.',
      type: 'audio',
      category: 'anxiety',
      language: 'hindi',
      duration: '12 minutes',
      rating: 4.9,
      views: 892,
      featured: true
    },
    {
      id: '3',
      title: 'Sleep Hygiene for Better Mental Health',
      description: 'Learn how proper sleep habits can significantly improve your mental wellbeing.',
      type: 'video',
      category: 'sleep',
      language: 'english',
      duration: '18 minutes',
      rating: 4.7,
      views: 2156,
      featured: false
    },
    {
      id: '4',
      title: 'Mindfulness Meditation for Beginners',
      description: 'Introduction to mindfulness practices specifically designed for busy students.',
      type: 'video',
      category: 'mindfulness',
      language: 'english',
      duration: '25 minutes',
      rating: 4.6,
      views: 3421,
      featured: true
    },
    {
      id: '5',
      title: 'Managing Academic Stress Worksheet',
      description: 'Interactive worksheet to help identify stress triggers and develop coping strategies.',
      type: 'worksheet',
      category: 'academic',
      language: 'english',
      duration: '30 minutes',
      rating: 4.5,
      views: 678,
      featured: false
    },
    {
      id: '6',
      title: 'Building Healthy Relationships',
      description: 'Guide to maintaining positive relationships during college years.',
      type: 'article',
      category: 'relationships',
      language: 'regional',
      duration: '20 min read',
      rating: 4.4,
      views: 543,
      featured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'anxiety', label: 'Anxiety & Panic' },
    { value: 'depression', label: 'Depression' },
    { value: 'stress', label: 'Stress Management' },
    { value: 'sleep', label: 'Sleep & Rest' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'academic', label: 'Academic Pressure' },
    { value: 'mindfulness', label: 'Mindfulness' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'regional', label: 'Regional Languages' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'article', label: 'Articles' },
    { value: 'guide', label: 'Guides' },
    { value: 'worksheet', label: 'Worksheets' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesLanguage && matchesType;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'worksheet': return <Download className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-red-100 text-red-800',
      depression: 'bg-blue-100 text-blue-800',
      stress: 'bg-orange-100 text-orange-800',
      sleep: 'bg-purple-100 text-purple-800',
      relationships: 'bg-pink-100 text-pink-800',
      academic: 'bg-green-100 text-green-800',
      mindfulness: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Psychoeducational Resource Hub
          </CardTitle>
          <CardDescription>
            Access curated mental health resources, guides, and educational content in multiple languages
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="my-library">My Library</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Resources</CardTitle>
              <CardDescription>Hand-picked resources recommended by our mental health professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                          {resource.rating}
                        </Badge>
                      </div>
                      
                      <h3 className="font-medium mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          {resource.views} views
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          {resource.type === 'video' ? 'Watch' : 
                           resource.type === 'audio' ? 'Listen' : 'Read'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Resources</CardTitle>
              <CardDescription>Find specific resources based on your needs and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <Badge variant="secondary" className="text-xs capitalize">
                        {resource.type}
                      </Badge>
                    </div>
                    <Badge className={`${getCategoryColor(resource.category)} text-xs`}>
                      {resource.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium mb-2 text-sm">{resource.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{resource.duration}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      {resource.rating}
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No resources found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Resources</CardTitle>
              <CardDescription>Resources you've bookmarked and downloaded for offline access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No saved resources yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building your personal library by saving resources that are helpful to you.
                </p>
                <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>
                  Browse Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Language Support</CardTitle>
          <CardDescription>Resources available in multiple languages for cultural accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">English</h4>
              <p className="text-sm text-muted-foreground">45+ resources</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Hindi</h4>
              <p className="text-sm text-muted-foreground">32+ resources</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Regional Languages</h4>
              <p className="text-sm text-muted-foreground">18+ resources</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceHub;