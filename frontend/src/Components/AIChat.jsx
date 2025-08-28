import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, AlertTriangle, Heart, Phone } from 'lucide-react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: "Hello! I'm here to provide emotional support and coping strategies. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  const emergencyKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'hopeless'];
  const anxietyKeywords = ['anxious', 'panic', 'worried', 'stress', 'overwhelmed'];
  const depressionKeywords = ['sad', 'depressed', 'lonely', 'empty', 'worthless'];

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for emergency situations
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        id: Date.now().toString(),
        content: "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to the emergency helpline immediately at 1800-XXX-XXXX or contact emergency services at 911. Would you like me to help you connect with a counselor right away?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'emergency'
      };
    }

    // Anxiety-related responses
    if (anxietyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const responses = [
        "I understand you're feeling anxious. Let's try a quick grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This can help bring you back to the present moment.",
        "Anxiety can feel overwhelming, but remember that this feeling will pass. Try taking slow, deep breaths: breathe in for 4 counts, hold for 4, and breathe out for 6. Would you like to try this together?",
        "It sounds like you're dealing with a lot of stress. One technique that helps many students is progressive muscle relaxation. Start by tensing and then relaxing each muscle group in your body, starting with your toes and working up."
      ];
      return {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date(),
        type: 'normal'
      };
    }

    // Depression-related responses
    if (depressionKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const responses = [
        "I hear that you're going through a difficult time. Depression can make everything feel heavy, but you've taken a positive step by reaching out. Small actions like getting sunlight, staying hydrated, or reaching out to a friend can help. What's one small thing you could do for yourself today?",
        "Feeling sad or empty is really hard to experience. Remember that these feelings are valid, and you don't have to go through this alone. Sometimes it helps to write down three things you're grateful for, even small ones. Would you like to try that?",
        "Loneliness can be really painful. Even when it doesn't feel like it, there are people who care about you. Consider reaching out to someone you trust, or joining a peer support group. Would you like me to suggest some campus resources?"
      ];
      return {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date(),
        type: 'normal'
      };
    }

    // General supportive responses
    const generalResponses = [
      "Thank you for sharing that with me. It takes courage to talk about how you're feeling. Can you tell me more about what's been on your mind lately?",
      "I appreciate you opening up. Remember that seeking support is a sign of strength, not weakness. What would be most helpful for you right now?",
      "It sounds like you're dealing with some challenges. Many students go through similar experiences. What coping strategies have you tried before?",
      "I'm here to listen and support you. Sometimes just talking through our thoughts and feelings can be helpful. What's been the most difficult part of your day?"
    ];

    return {
      id: Date.now().toString(),
      content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'normal'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>AI Mental Health Support</CardTitle>
              <CardDescription>
                Confidential chat with AI trained in psychological first-aid techniques
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This AI provides general support and coping strategies. For urgent mental health crises, 
          please contact the emergency helpline: <strong>1800-XXX-XXXX</strong> or emergency services: <strong>911</strong>
        </AlertDescription>
      </Alert>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">AI Assistant Online</span>
            </div>
            <Badge variant="secondary">Confidential Session</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : message.type === 'emergency'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-6">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message... Your conversation is confidential."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Breathing Exercise
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Connect to Counselor
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                End-to-end encrypted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;