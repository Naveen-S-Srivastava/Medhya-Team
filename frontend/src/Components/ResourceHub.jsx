import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { BookOpen, Play, Headphones, Bookmark, Search, Filter, Star, Clock, Eye, Loader2, X, ExternalLink, BookmarkCheck } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { useUserLibrary } from '../hooks/useUserLibrary';

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResourceUrl, setSelectedResourceUrl] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showUrlPopup, setShowUrlPopup] = useState(false);

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
    if (!type) return <BookOpen className="w-5 h-5 text-gray-500" />;
    switch (type) {
      case 'video': return <Play className="w-5 h-5 text-blue-500" />;
      case 'audio': return <Headphones className="w-5 h-5 text-purple-500" />;
      case 'article': return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'worksheet': return <Bookmark className="w-5 h-5 text-orange-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    const colors = {
      anxiety: 'bg-red-50 text-red-700 border-red-200',
      depression: 'bg-blue-50 text-blue-700 border-blue-200',
      stress: 'bg-orange-50 text-orange-700 border-orange-200',
      sleep: 'bg-purple-50 text-purple-700 border-purple-200',
      relationships: 'bg-pink-50 text-pink-700 border-pink-200',
      academic: 'bg-green-50 text-green-700 border-green-200',
      mindfulness: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <span className="ml-4 text-lg text-gray-600">Loading resources...</span>
    </div>
  );

  const ErrorMessage = ({ error }) => (
    <Card className="shadow-lg rounded-xl">
      <CardContent className="py-12 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2 text-gray-800">Error loading resources</h3>
        <p className="text-md text-gray-500 mb-6">
          {error || 'Something went wrong. Please try again later.'}
        </p>
        <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          Retry
        </Button>
      </CardContent>
    </Card>
  );

  // URL Popup Component
  const UrlPopup = ({ url, resource, onClose }) => {
    if (!url) return null;

    const isVideo = resource?.type === 'video';
    const isAudio = resource?.type === 'audio';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">{resource?.title || 'Resource Viewer'}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, '_blank')}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-50 text-gray-700"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4">
            {(isVideo || isAudio) ? (
              <div className="w-full h-full rounded-lg overflow-hidden shadow-inner">
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  title={resource?.title || "Resource Content"}
                  allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                  <h3 className="font-semibold text-2xl mb-2 text-gray-800">External Resource</h3>
                  <p className="text-md text-gray-500 mb-8">
                    This resource is hosted externally and cannot be previewed here. 
                    Click the button below to open it in a new tab.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => window.open(url, '_blank')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Resource
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full border-gray-300 hover:bg-gray-100"
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle resource access
  const handleAccessResource = (resource) => {
    if (resource.url) {
      setSelectedResourceUrl(resource.url);
      setSelectedResource(resource);
      setShowUrlPopup(true);
    } else {
      // Fallback for resources without URLs
      alert('This resource is not available online. Please contact support for access.');
    }
  };

  // Handle save/remove from library
  const handleToggleSave = async (resourceId) => {
    try {
      const isInLibrary = userResources?.some(ur => ur.resource._id === resourceId);
      
      if (isInLibrary) {
        await removeFromLibrary(resourceId);
        // Show success message
        console.log('Resource removed from library');
      } else {
        await saveResource(resourceId);
        // Show success message
        console.log('Resource added to library');
      }
      
      // Refresh user library
      getUserLibrary(1, 12);
    } catch (error) {
      console.error('Error toggling save:', error);
      // Show error message
      alert('Failed to update library. Please try again.');
    }
  };

  // Check if resource is in user's library
  const isResourceInLibrary = (resourceId) => {
    return userResources?.some(ur => ur.resource._id === resourceId) || false;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 transition-colors duration-500">
      
      <Card className="shadow-2xl rounded-2xl mb-8 transform transition-transform duration-500 hover:scale-[1.005]">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-4xl font-extrabold text-indigo-800">
            <BookOpen className="w-10 h-10 text-indigo-600" />
            Psychoeducational Resource Hub
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 mt-2">
            Access curated mental health resources, guides, and educational content in multiple languages
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="browse" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gray-200 p-1 shadow-inner">
          <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300">Featured</TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300">Browse All</TabsTrigger>
          <TabsTrigger value="my-library" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300">My Library</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <Card className="shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Featured Resources</CardTitle>
              <CardDescription className="text-md text-gray-600">Hand-picked resources recommended by our mental health professionals</CardDescription>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <LoadingSpinner />
              ) : resourcesError ? (
                <ErrorMessage error={resourcesError} />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources?.filter(resource => resource.isFeatured).map((resource) => (
                    <Card key={resource._id} className="shadow-md rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-md">{getTypeIcon(resource.type)}</div>
                          <Badge className={`text-xs font-semibold px-3 py-1 border ${getCategoryColor(resource.category)}`}>
                            {resource.category}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200">
                          <Star className="w-3 h-3 fill-current" />
                          {resource.averageRating?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2 text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{resource.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleAccessResource(resource)}
                        >
                          {resource.type === 'video' ? 'Watch' : 
                            resource.type === 'audio' ? 'Listen' : 'Read'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleSave(resource._id)}
                          className={`
                            border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300
                            ${isResourceInLibrary(resource._id) ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' : ''}
                          `}
                          title={isResourceInLibrary(resource._id) ? 'Remove from library' : 'Add to library'}
                        >
                          {isResourceInLibrary(resource._id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <Card className="shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Search & Filter Resources</CardTitle>
              <CardDescription className="text-md text-gray-600">Find specific resources based on your needs and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-6 rounded-full border-2 border-gray-300 focus-visible:ring-indigo-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                  <Filter className="w-5 h-5" />
                  Filters
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-2 border-green-300 bg-white text-green-800 focus-visible:ring-green-500 rounded-full py-3 px-6 transition-colors hover:bg-green-50">
                    <SelectValue placeholder="Category" className="text-green-800" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="border-2 border-green-300 bg-white text-green-800 focus-visible:ring-green-500 rounded-full py-3 px-6 transition-colors hover:bg-green-50">
                    <SelectValue placeholder="Language" className="text-green-800" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg">
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-2 border-green-300 bg-white text-green-800 focus-visible:ring-green-500 rounded-full py-3 px-6 transition-colors hover:bg-green-50">
                    <SelectValue placeholder="Type" className="text-green-800" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg">
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {resourcesLoading ? (
            <LoadingSpinner />
          ) : resourcesError ? (
            <ErrorMessage error={resourcesError} />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources?.map((resource) => (
                  <Card key={resource._id} className="shadow-md rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-md">{getTypeIcon(resource.type)}</div>
                        <Badge className={`text-xs font-semibold px-3 py-1 border ${getCategoryColor(resource.category)}`}>
                          {resource.category}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200">
                        <Star className="w-3 h-3 fill-current" />
                        {resource.averageRating?.toFixed(1) || 'N/A'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{resource.views} views</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleAccessResource(resource)}
                      >
                        Access Resource
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleSave(resource._id)}
                        className={`
                          border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300
                          ${isResourceInLibrary(resource._id) ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' : ''}
                        `}
                        title={isResourceInLibrary(resource._id) ? 'Remove from library' : 'Add to library'}
                      >
                        {isResourceInLibrary(resource._id) ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {resources && resources.length === 0 && (
                <Card className="shadow-lg rounded-xl bg-white">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2 text-gray-800">No resources found</h3>
                    <p className="text-md text-gray-500">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {resourcesPagination && resourcesPagination.totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border-gray-300 hover:bg-gray-100 px-6"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-md font-medium text-gray-700">
                    Page {currentPage} of {resourcesPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={currentPage === resourcesPagination.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="border-gray-300 hover:bg-gray-100 px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-library" className="space-y-6">
          <Card className="shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">My Saved Resources</CardTitle>
              <CardDescription className="text-md text-gray-600">Resources you've bookmarked for easy access</CardDescription>
            </CardHeader>
            <CardContent>
              {libraryLoading ? (
                <LoadingSpinner />
              ) : libraryError ? (
                <ErrorMessage error={libraryError} />
              ) : userResources && userResources.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userResources?.map((userResource) => (
                    <Card key={userResource._id} className="shadow-md rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-md">{getTypeIcon(userResource.resource.type)}</div>
                          <Badge className={`text-xs font-semibold px-3 py-1 border ${getCategoryColor(userResource.resource.category)}`}>
                            {userResource.resource.category}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200">
                          <Star className="w-3 h-3 fill-current" />
                          {userResource.resource.averageRating?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2 text-gray-900">{userResource.resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{userResource.resource.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{userResource.resource.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{userResource.resource.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleAccessResource(userResource.resource)}
                        >
                          Access Resource
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveFromLibrary(userResource.resource._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-300"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-gray-800">No saved resources yet</h3>
                  <p className="text-md text-gray-500 mb-6">
                    Start building your personal library by bookmarking resources that are helpful to you.
                  </p>
                  <Button 
                    onClick={() => document.querySelector('[value="browse"]')?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  >
                    Browse Resources
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Language Support</CardTitle>
          <CardDescription className="text-md text-gray-600">Resources available in multiple languages for cultural accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 border-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-gray-200">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">English</h4>
              <p className="text-sm text-gray-600">45+ resources</p>
            </div>
            <div className="text-center p-6 border-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-gray-200">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Hindi</h4>
              <p className="text-sm text-gray-600">32+ resources</p>
            </div>
            <div className="text-center p-6 border-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-gray-200">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Regional Languages</h4>
              <p className="text-sm text-gray-600">18+ resources</p>
            </div>
          </div>
        </CardContent>
      </Card>

    {showUrlPopup && (
      <UrlPopup 
        url={selectedResourceUrl} 
        resource={selectedResource}
        onClose={() => {
          setShowUrlPopup(false);
          setSelectedResourceUrl(null);
          setSelectedResource(null);
        }} 
      />
    )}
    </div>
  );
};

export default ResourceHub;