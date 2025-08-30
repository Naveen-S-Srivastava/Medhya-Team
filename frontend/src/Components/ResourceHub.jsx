import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { BookOpen, Play, Headphones, Download, Search, Filter, Star, Clock, Eye, Loader2 } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { useUserLibrary } from '../hooks/useUserLibrary';

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { 
    resources, 
    loading: resourcesLoading, 
    error: resourcesError, 
    pagination: resourcesPagination,
    getResources, 
    getFeaturedResources 
  } = useResources();

  const { 
    userResources, 
    loading: libraryLoading, 
    error: libraryError, 
    pagination: libraryPagination,
    getUserLibrary, 
    saveResource,
    removeFromLibrary
  } = useUserLibrary();

  // Fetch data on component mount
  useEffect(() => {
    getResources({}, currentPage, 12);
    getFeaturedResources(6);
    getUserLibrary(1, 12);
  }, []);

  // Fetch resources when filters change
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      resourceLanguage: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      type: selectedType !== 'all' ? selectedType : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    getResources(filters, currentPage, 12);
  }, [searchTerm, selectedCategory, selectedLanguage, selectedType, currentPage]);

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

  const getTypeIcon = (type) => {
    if (!type) return <BookOpen className="w-4 h-4" />;
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
    if (!category) return 'bg-gray-100 text-gray-800';
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

  const handleSaveResource = async (resourceId) => {
    try {
      await saveResource(resourceId);
      // Refresh user library
      getUserLibrary(1, 12);
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleRemoveFromLibrary = async (resourceId) => {
    try {
      await removeFromLibrary(resourceId);
      // Refresh user library
      getUserLibrary(1, 12);
    } catch (error) {
      console.error('Error removing resource:', error);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="ml-2">Loading resources...</span>
    </div>
  );

  const ErrorMessage = ({ error }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Error loading resources</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error || 'Something went wrong. Please try again later.'}
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );

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
              {resourcesLoading ? (
                <LoadingSpinner />
              ) : resourcesError ? (
                <ErrorMessage error={resourcesError} />
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {resources?.filter(resource => resource.isFeatured).map((resource) => (
                    <Card key={resource._id} className="hover:shadow-md transition-shadow">
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
                            {resource.averageRating?.toFixed(1) || 'N/A'}
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSaveResource(resource._id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
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
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
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
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
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

          {resourcesLoading ? (
            <LoadingSpinner />
          ) : resourcesError ? (
            <ErrorMessage error={resourcesError} />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources?.map((resource) => (
                  <Card key={resource._id} className="hover:shadow-md transition-shadow">
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
                          {resource.averageRating?.toFixed(1) || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Access Resource
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSaveResource(resource._id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {resources && resources.length === 0 && (
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

              {/* Pagination */}
              {resourcesPagination && resourcesPagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {currentPage} of {resourcesPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === resourcesPagination.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Resources</CardTitle>
              <CardDescription>Resources you've bookmarked and downloaded for offline access</CardDescription>
            </CardHeader>
            <CardContent>
              {libraryLoading ? (
                <LoadingSpinner />
              ) : libraryError ? (
                <ErrorMessage error={libraryError} />
              ) : userResources && userResources.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userResources?.map((userResource) => (
                    <Card key={userResource._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(userResource.resource.type)}
                            <Badge variant="secondary" className="text-xs capitalize">
                              {userResource.resource.type}
                            </Badge>
                          </div>
                          <Badge className={`${getCategoryColor(userResource.resource.category)} text-xs`}>
                            {userResource.resource.category}
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium mb-2 text-sm">{userResource.resource.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{userResource.resource.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>{userResource.resource.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            {userResource.resource.averageRating?.toFixed(1) || 'N/A'}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Access Resource
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveFromLibrary(userResource.resource._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
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
              )}
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