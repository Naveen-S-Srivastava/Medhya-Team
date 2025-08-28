import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Calendar } from '../ui/Calendar';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, Video, Shield } from 'lucide-react';

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('oncampus');
  const [reason, setReason] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('routine');
  const [showSuccess, setShowSuccess] = useState(false);

  const counselors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: ['Anxiety', 'Depression', 'Academic Stress'],
      languages: ['English', 'Hindi'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      type: 'oncampus',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Dr. Raj Patel',
      specialization: ['Relationship Issues', 'Social Anxiety', 'Career Counseling'],
      languages: ['English', 'Hindi', 'Gujarati'],
      availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
      type: 'oncampus',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Dr. Priya Sharma',
      specialization: ['Trauma', 'PTSD', 'Family Issues'],
      languages: ['English', 'Hindi', 'Punjabi'],
      availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
      type: 'online',
      rating: 4.7
    }
  ];

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '02:00 PM', available: false },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '05:00 PM', available: true }
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedCounselor || !selectedTime) return;
    
    // Simulate booking process
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedCounselor('');
      setSelectedTime('');
      setReason('');
      setUrgencyLevel('routine');
    }, 3000);
  };

  const selectedCounselorData = counselors.find(c => c.id === selectedCounselor);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Book Confidential Appointment
          </CardTitle>
          <CardDescription>
            Schedule a private session with our licensed mental health professionals
          </CardDescription>
        </CardHeader>
      </Card>

      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your appointment has been booked successfully! You'll receive a confidential confirmation email shortly. 
            Remember, all sessions are completely private and secure.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>Choose your preferred appointment date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oncampus">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      In-Person (On Campus)
                    </div>
                  </SelectItem>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Online Session
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                className="rounded-md border"
              />
            </div>

            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="justify-start"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Counselor</CardTitle>
            <CardDescription>Choose a counselor based on your needs and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {counselors
              .filter(counselor => counselor.type === appointmentType)
              .map((counselor) => (
                <Card 
                  key={counselor.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCounselor === counselor.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCounselor(counselor.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium">{counselor.name}</h4>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialization.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Languages: {counselor.languages.join(', ')}</span>
                          <span>★ {counselor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {counselor.type === 'oncampus' ? (
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Video className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Provide additional information about your session needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine - Regular support session</SelectItem>
                <SelectItem value="urgent">Urgent - Need support soon</SelectItem>
                <SelectItem value="crisis">Crisis - Immediate attention needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Brief Description (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe what you'd like to discuss. This helps the counselor prepare for your session."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This information is confidential and will only be shared with your selected counselor.
            </p>
          </div>

          {selectedCounselorData && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Appointment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Counselor:</span>
                    <span>{selectedCounselorData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{appointmentType === 'oncampus' ? 'In-Person' : 'Online'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgency:</span>
                    <Badge variant={urgencyLevel === 'crisis' ? 'destructive' : urgencyLevel === 'urgent' ? 'default' : 'secondary'}>
                      {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center pt-4">
            <Alert className="flex-1 mr-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All appointments are completely confidential and HIPAA compliant.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedCounselor || !selectedTime}
              className="min-w-[120px]"
            >
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Resources</CardTitle>
          <CardDescription>If you need immediate help, please use these resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Crisis Helpline</p>
                <p className="text-sm text-red-700">1800-XXX-XXXX (24/7)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Campus Health Center</p>
                <p className="text-sm text-blue-700">Building A, Room 101</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;