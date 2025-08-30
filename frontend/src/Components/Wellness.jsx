import React, { useState, useEffect } from 'react'
import { CardHeader, CardTitle, Card, CardDescription, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { Alert, AlertDescription } from '../ui/Alert'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/TextArea'
import { Badge } from '../ui/Badge'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { Heart, Brain, Clock, TrendingUp, CheckCircle, Target, Calendar, BarChart3, X, Plus, BookOpen, Edit, Trash2, Loader2, Send } from 'lucide-react'
import { useJournal } from '../hooks/useJournal.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAssessment } from '../hooks/useAssessment.js'
import { calculateWellnessScore, getWellnessLevel } from '../utils/wellnessCalculator.js'
import StressAssessment from './StressAssessment.jsx'

export default function Wellness() {
  const { user } = useAuth();
  const { 
    entries, 
    todayEntry, 
    weeklyProgress, 
    stats, 
    loading, 
    error, 
    pagination,
    getJournalEntries, 
    getTodayEntry, 
    getWeeklyProgress, 
    getJournalStats,
    createJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    clearError
  } = useJournal();

  const {
    todayAssessments,
    getTodayAssessments
  } = useAssessment();

  const [currentMood, setCurrentMood] = useState(null)
  // Calculate wellness score from assessments
  const calculateCurrentWellnessScore = () => {
    const gad7Score = todayAssessments['GAD-7']?.score || 0;
    const phq9Score = todayAssessments['PHQ-9']?.score || 0;
    
    if (gad7Score === 0 && phq9Score === 0) {
      return 78; // Default score if no assessments
    }
    
    return calculateWellnessScore(gad7Score, phq9Score);
  };
  
  const wellnessScore = calculateCurrentWellnessScore();
  const wellnessLevel = getWellnessLevel(wellnessScore);
  const [showJournalPopup, setShowJournalPopup] = useState(false)
  const [showStressAssessment, setShowStressAssessment] = useState(false)
  const [activeTab, setActiveTab] = useState('write')
  const [currentPage, setCurrentPage] = useState(1)

  // Journal form state
  const [journalForm, setJournalForm] = useState({
    content: '',
    mood: '',
    moodScore: 5,
    tags: '',
    wellnessScore: 0,
    sleepHours: 8,
    stressLevel: 5,
    activities: '',
    gratitude: '',
    goals: '',
    challenges: '',
    achievements: ''
  })

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-green-100 text-green-800' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'bg-orange-100 text-orange-800' },
    { emoji: '😡', label: 'Stressed', value: 'stressed', color: 'bg-red-100 text-red-800' }
  ]

  const wellnessTips = [
    "Take a 5-minute breathing break every hour",
    "Practice gratitude by writing 3 things you're thankful for",
    "Get 7-9 hours of quality sleep tonight",
    "Take a 10-minute walk outside",
    "Connect with a friend or family member"
  ]

  // Load data on component mount
  useEffect(() => {
    getTodayEntry();
    getWeeklyProgress();
    getJournalStats();
    getJournalEntries({ page: currentPage, limit: 10 });
    getTodayAssessments();
  }, [currentPage]);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood)
    // Here you would typically save to backend
    console.log('Mood selected:', mood)
  }

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const entryData = {
        content: journalForm.content,
        mood: journalForm.mood,
        moodScore: parseInt(journalForm.moodScore),
        tags: journalForm.tags ? journalForm.tags.split(',').map(tag => tag.trim()) : [],
        wellnessScore: parseInt(journalForm.wellnessScore),
        sleepHours: parseFloat(journalForm.sleepHours),
        stressLevel: parseInt(journalForm.stressLevel),
        activities: journalForm.activities ? journalForm.activities.split(',').map(activity => activity.trim()) : [],
        gratitude: journalForm.gratitude ? journalForm.gratitude.split(',').map(item => item.trim()) : [],
        goals: journalForm.goals ? journalForm.goals.split(',').map(goal => goal.trim()) : [],
        challenges: journalForm.challenges ? journalForm.challenges.split(',').map(challenge => challenge.trim()) : [],
        achievements: journalForm.achievements ? journalForm.achievements.split(',').map(achievement => achievement.trim()) : []
      };

      await createJournalEntry(entryData);
      
      // Reset form
      setJournalForm({
        content: '',
        mood: '',
        moodScore: 5,
        tags: '',
        wellnessScore: 0,
        sleepHours: 8,
        stressLevel: 5,
        activities: '',
        gratitude: '',
        goals: '',
        challenges: '',
        achievements: ''
      });
      
      setActiveTab('view');
    } catch (err) {
      console.error('Failed to create journal entry:', err);
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  }

  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption ? moodOption.emoji : '😐';
  }

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption ? moodOption.color : 'bg-gray-100 text-gray-800';
  }

  return (
    <div className="space-y-6 bg-blue-50">
      {/* Main Wellness Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Wellness Tracking & Mood Analysis
          </CardTitle>
          <CardDescription>
            AI-powered mood tracking with personalized insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Wellness Features</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Track your mood, sleep patterns, stress levels, and receive AI-powered insights 
              for better mental health management.
            </p>
            <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Heart className="w-6 h-6" />
                <span>Daily Mood Check-in</span>
              </Button>
              <Button 
                className="h-16 flex-col gap-2" 
                variant="outline"
                onClick={() => setShowStressAssessment(true)}
              >
                <Brain className="w-6 h-6" />
                <span>Stress Assessment</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Clock className="w-6 h-6" />
                <span>Sleep Quality Tracker</span>
              </Button>
                             <Button 
                 className="h-16 flex-col gap-2" 
                 variant="outline"
                 onClick={() => {
                   setShowJournalPopup(true);
                   clearError(); // Clear any previous errors
                 }}
               >
                <TrendingUp className="w-6 h-6" />
                <span>Wellness Insights (Journal)</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Wellness Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Current Wellness Score
            </CardTitle>
          </CardHeader>
                     <CardContent>
             <div className="text-center">
               <div className="text-4xl font-bold text-green-600 mb-2">{wellnessScore}%</div>
               <Progress value={wellnessScore} className="mb-4" />
               <p className={`text-sm font-medium mb-2 ${wellnessLevel.color}`}>
                 {wellnessLevel.level} Wellness
               </p>
               <p className="text-sm text-muted-foreground">
                 {wellnessScore >= 80 ? 'Excellent! Keep up the great work!' : 
                  wellnessScore >= 60 ? 'Good progress! You\'re doing well.' : 
                  wellnessScore >= 40 ? 'Fair wellness. Consider taking assessments to improve.' :
                  'Let\'s work on improving your wellness together. Try the stress assessments!'}
               </p>
               {(todayAssessments['GAD-7']?.score !== undefined || todayAssessments['PHQ-9']?.score !== undefined) && (
                 <div className="mt-3 text-xs text-muted-foreground">
                   <p>Based on today's assessments:</p>
                   {todayAssessments['GAD-7']?.score !== undefined && <p>GAD-7: {todayAssessments['GAD-7'].score}</p>}
                   {todayAssessments['PHQ-9']?.score !== undefined && <p>PHQ-9: {todayAssessments['PHQ-9'].score}</p>}
                 </div>
               )}
             </div>
           </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Daily Mood Check-in
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={currentMood === mood.value ? "default" : "outline"}
                  className={`h-16 flex-col gap-1 ${currentMood === mood.value ? mood.color : ''}`}
                  onClick={() => handleMoodSelect(mood.value)}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
            {currentMood && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Thank you for checking in! Your mood has been recorded.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Weekly Wellness Progress
          </CardTitle>
          <CardDescription>Your wellness score over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div className="w-full bg-gray-200 rounded-full h-24 relative">
                  {day.hasEntry ? (
                    <>
                      <div 
                        className="bg-gradient-to-t from-green-400 to-green-600 rounded-full absolute bottom-0 w-full"
                        style={{ height: `${day.entry?.wellnessScore || 70}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-bold text-white">{day.entry?.wellnessScore || 70}%</span>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No entry</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.hasEntry && day.entry?.mood && (
                    <span>{getMoodEmoji(day.entry.mood)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            Today's Wellness Tips
          </CardTitle>
          <CardDescription>Personalized recommendations for better mental health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wellnessTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journal Popup */}
      {showJournalPopup && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Wellness Journal
              </h2>
              <div className="flex items-center gap-2">
                {error && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearError()}
                  >
                    Clear Error
                  </Button>
                )}
                                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => {
                     setShowJournalPopup(false);
                     clearError(); // Clear errors when closing popup
                   }}
                 >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              clearError(); // Clear errors when switching tabs
            }} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 p-6 pt-0 flex-shrink-0">
                <TabsTrigger value="write">Write Today's Journal</TabsTrigger>
                <TabsTrigger value="view">View All Journals</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="p-6 pt-0 flex-1 overflow-y-auto">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {todayEntry ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Journal Entry Already Written</h3>
                    <p className="text-muted-foreground mb-4">
                      You've already written your journal entry for today. You can view it in the "View All Journals" tab.
                    </p>
                    <Button onClick={() => setActiveTab('view')}>
                      View Today's Entry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleJournalSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                        <Select value={journalForm.mood} onValueChange={(value) => setJournalForm({...journalForm, mood: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your mood" />
                          </SelectTrigger>
                          <SelectContent>
                            {moodOptions.map((mood) => (
                              <SelectItem key={mood.value} value={mood.value}>
                                <span className="flex items-center gap-2">
                                  <span>{mood.emoji}</span>
                                  <span>{mood.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Mood Score (1-10)</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={journalForm.moodScore}
                          onChange={(e) => setJournalForm({...journalForm, moodScore: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Today's Journal Entry</label>
                      <Textarea
                        placeholder="Write about your day, thoughts, feelings, or anything you'd like to reflect on..."
                        value={journalForm.content}
                        onChange={(e) => setJournalForm({...journalForm, content: e.target.value})}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Wellness Score (0-100)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={journalForm.wellnessScore}
                          onChange={(e) => setJournalForm({...journalForm, wellnessScore: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Hours of Sleep</label>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={journalForm.sleepHours}
                          onChange={(e) => setJournalForm({...journalForm, sleepHours: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Stress Level (1-10)</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={journalForm.stressLevel}
                          onChange={(e) => setJournalForm({...journalForm, stressLevel: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                        <Input
                          placeholder="productive, grateful, exercise"
                          value={journalForm.tags}
                          onChange={(e) => setJournalForm({...journalForm, tags: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Activities (comma-separated)</label>
                        <Input
                          placeholder="studying, exercise, socializing"
                          value={journalForm.activities}
                          onChange={(e) => setJournalForm({...journalForm, activities: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Gratitude (comma-separated)</label>
                        <Input
                          placeholder="Supportive friends, Good health"
                          value={journalForm.gratitude}
                          onChange={(e) => setJournalForm({...journalForm, gratitude: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Goals (comma-separated)</label>
                        <Input
                          placeholder="Complete project, Exercise regularly"
                          value={journalForm.goals}
                          onChange={(e) => setJournalForm({...journalForm, goals: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Challenges (comma-separated)</label>
                        <Input
                          placeholder="Time management, Stress"
                          value={journalForm.challenges}
                          onChange={(e) => setJournalForm({...journalForm, challenges: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Achievements (comma-separated)</label>
                      <Input
                        placeholder="Finished project, Went for a run"
                        value={journalForm.achievements}
                        onChange={(e) => setJournalForm({...journalForm, achievements: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                                             <Button
                         type="button"
                         variant="outline"
                         onClick={() => {
                           setShowJournalPopup(false);
                           clearError(); // Clear errors when canceling
                         }}
                       >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Save Journal Entry
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="view" className="p-6 pt-0 flex-1 overflow-y-auto">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading journal entries...</span>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No journal entries yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your wellness journey by writing your first journal entry.
                    </p>
                    <Button onClick={() => setActiveTab('write')}>
                      Write First Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <Card key={entry._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {user?.firstName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getTimeAgo(entry.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getMoodColor(entry.mood)}>
                                {getMoodEmoji(entry.mood)} {entry.mood}
                              </Badge>
                              <Badge variant="outline">
                                Score: {entry.wellnessScore}%
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{entry.content}</p>

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {entry.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                            {entry.sleepHours && (
                              <div>Sleep: {entry.sleepHours} hours</div>
                            )}
                            {entry.stressLevel && (
                              <div>Stress Level: {entry.stressLevel}/10</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {pagination.pages > 1 && (
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
                          Page {currentPage} of {pagination.pages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === pagination.pages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Stress Assessment Popup */}
      {showStressAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Stress Assessment</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStressAssessment(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
                             <StressAssessment 
                 isPopup={true} 
                 onAssessmentComplete={() => {
                   getTodayAssessments();
                 }}
               />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
