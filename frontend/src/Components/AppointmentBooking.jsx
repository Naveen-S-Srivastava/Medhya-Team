import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Calendar } from '../ui/Calendar';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, Video, Shield, Loader2, CheckCircle, Search } from 'lucide-react';
import { appointmentAPI } from '../services/api';
import { useApi, useOptimisticUpdate } from '../hooks/useApi';
import { useCounselors } from '../hooks/useCounselors';

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('oncampus');
  const [reason, setReason] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('routine');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student ID - in a real app this would come from a user context
  const studentId = 'demo-student-123';

  // Fetch existing appointments for the student
  const { data: existingAppointments, loading: appointmentsLoading, refetch: refetchAppointments } = useApi(
    () => appointmentAPI.getStudentAppointments(studentId),
    []
  );

  // Optimistic updates for appointment creation
  const { updateOptimistically } = useOptimisticUpdate(
    (appointmentData) => appointmentAPI.createAppointment(appointmentData)
  );

  // Counselor data hook
  const { 
    counselors, 
    loading: counselorsLoading, 
    error: counselorsError,
    getCounselors,
    getAvailableSlots 
  } = useCounselors();

  // Available time slots for selected counselor and date
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch counselors on component mount
  useEffect(() => {
    getCounselors();
  }, []);

  // Fetch available slots when counselor or date changes
  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedCounselor, selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedCounselor || !selectedDate) return;
    
    setSlotsLoading(true);
    try {
      const slots = await getAvailableSlots(selectedCounselor, selectedDate.toISOString().split('T')[0]);
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Filter counselors based on search term and appointment type
  const filteredCounselors = counselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = counselor.appointmentType === appointmentType || counselor.appointmentType === 'both';
    return matchesSearch && matchesType;
  });

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedCounselor || !selectedTime) return;
    
    setIsSubmitting(true);
    
    try {
             const appointmentData = {
         student: studentId,
         counselor: selectedCounselor,
         institutionId: 'demo-institution-123',
         appointmentType,
         date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
         timeSlot: selectedTime,
         urgencyLevel,
         reason: reason.trim() || undefined,
         status: 'pending'
       };

      await updateOptimistically(appointmentData, (prevData) => {
        // Optimistic update - add new appointment to the list
        return prevData ? [...prevData, { ...appointmentData, _id: 'temp-id', bookedAt: new Date() }] : [appointmentData];
      });

      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedCounselor('');
        setSelectedTime('');
        setReason('');
        setUrgencyLevel('routine');
        refetchAppointments(); // Refresh the appointments list
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCounselorData = counselors.find(c => c._id === selectedCounselor);

  // Check if selected time slot conflicts with existing appointments
  const isTimeSlotConflict = (timeSlot) => {
    if (!existingAppointments) return false;
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return existingAppointments.some(appointment => {
      const appointmentDate = appointment.date;
      return appointmentDate === selectedDateStr && appointment.timeSlot === timeSlot;
    });
  };

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
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your appointment has been booked successfully! You'll receive a confidential confirmation email shortly. 
            Remember, all sessions are completely private and secure.
          </AlertDescription>
        </Alert>
      )}

      {/* Existing Appointments */}
      {existingAppointments && existingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Your Upcoming Appointments
            </CardTitle>
            <CardDescription>Manage your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingAppointments
                .filter(appointment => new Date(appointment.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
                .map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {appointment.appointmentType === 'oncampus' ? (
                          <MapPin className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Video className="w-4 h-4 text-green-600" />
                        )}
                        <span className="font-medium">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                        </span>
                      </div>
                      <Badge variant={
                        appointment.urgencyLevel === 'crisis' ? 'destructive' : 
                        appointment.urgencyLevel === 'urgent' ? 'default' : 'secondary'
                      }>
                        {appointment.urgencyLevel.charAt(0).toUpperCase() + appointment.urgencyLevel.slice(1)}
                      </Badge>
                    </div>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'pending' ? 'secondary' :
                      appointment.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Select Date & Time</CardTitle>
            <CardDescription className="text-gray-600">Choose your preferred appointment date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Choose appointment type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                  <SelectItem value="oncampus" className="py-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">In-Person (On Campus)</div>
                        <div className="text-xs text-gray-500">Meet at the counseling center</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="online" className="py-3">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Online Session</div>
                        <div className="text-xs text-gray-500">Video call from anywhere</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900">Select Date</Label>
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0; // Disable past dates and Sundays
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Sundays and past dates are not available for booking
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900">Available Time Slots</Label>
              {slotsLoading ? (
                <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="ml-3 text-sm text-gray-600">Loading available slots...</span>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => {
                    const isConflict = isTimeSlotConflict(slot.timeSlot);
                    const isAvailable = !isConflict;
                    
                    return (
                      <Button
                        key={slot.timeSlot}
                        variant={selectedTime === slot.timeSlot ? "default" : "outline"}
                        size="sm"
                        disabled={!isAvailable}
                        onClick={() => setSelectedTime(slot.timeSlot)}
                        className={`justify-start h-10 ${
                          selectedTime === slot.timeSlot 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'hover:bg-gray-50'
                        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-medium">{slot.timeSlot}</span>
                        {isConflict && <span className="ml-1 text-xs text-red-600">(Booked)</span>}
                      </Button>
                    );
                  })}
                </div>
              ) : selectedCounselor && selectedDate ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No available slots for this counselor on the selected date.</p>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Please select a counselor and date to see available time slots.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Select Counselor</CardTitle>
            <CardDescription className="text-gray-600">Choose a counselor based on your needs and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search counselors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {counselorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading counselors...</span>
              </div>
            ) : counselorsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading counselors: {counselorsError}</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {filteredCounselors.length > 0 ? (
                  filteredCounselors.map((counselor) => (
                    <Card 
                      key={counselor._id}
                      className={`cursor-pointer transition-colors ${
                        selectedCounselor === counselor._id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedCounselor(counselor._id)}
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
                              <span>★ {counselor.averageRating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {counselor.appointmentType === 'oncampus' ? (
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                            ) : counselor.appointmentType === 'online' ? (
                              <Video className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <div className="flex gap-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <Video className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No counselors found matching your search criteria.</p>
                  </div>
                )}
              </div>
            )}
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
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
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
              disabled={!selectedDate || !selectedCounselor || !selectedTime || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
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