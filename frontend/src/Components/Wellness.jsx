import React, { useState } from 'react'
import { CardHeader, CardTitle, Card, CardDescription, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { Alert, AlertDescription } from '../ui/Alert'
import { Heart, Brain, Clock, TrendingUp, CheckCircle, Target, Calendar, BarChart3 } from 'lucide-react'

export default function Wellness() {
  const [currentMood, setCurrentMood] = useState(null)
  const [wellnessScore, setWellnessScore] = useState(78)

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

  const weeklyProgress = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 80 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 78 }
  ]

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood)
    // Here you would typically save to backend
    console.log('Mood selected:', mood)
  }

  return (
    <div className="space-y-6">
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
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Brain className="w-6 h-6" />
                <span>Stress Assessment</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Clock className="w-6 h-6" />
                <span>Sleep Quality Tracker</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
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
              <p className="text-sm text-muted-foreground">
                {wellnessScore >= 80 ? 'Excellent! Keep up the great work!' : 
                 wellnessScore >= 60 ? 'Good progress! You\'re doing well.' : 
                 'Let\'s work on improving your wellness together.'}
              </p>
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
            {weeklyProgress.map((day) => (
              <div key={day.day} className="text-center">
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div className="w-full bg-gray-200 rounded-full h-24 relative">
                  <div 
                    className="bg-gradient-to-t from-green-400 to-green-600 rounded-full absolute bottom-0 w-full"
                    style={{ height: `${day.score}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-xs font-bold text-white">{day.score}%</span>
                  </div>
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
    </div>
  )
}
