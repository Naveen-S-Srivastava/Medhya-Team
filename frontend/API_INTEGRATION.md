# API Integration Documentation

## Overview

The frontend has been integrated with the backend API to fetch real data instead of using mock data. This integration includes:

- **Crisis Management**: Real-time crisis alerts with search, filter, and pagination
- **Appointment Booking**: Appointment creation and management with conflict detection
- **API Service Layer**: Centralized API handling with error management
- **Custom Hooks**: React hooks for API state management
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data loading with pagination support

## API Service Structure

### Core Files

1. **`src/services/api.js`** - Centralized API service layer
2. **`src/hooks/useApi.js`** - Custom React hooks for API management
3. **`src/utils/testApi.js`** - API testing utilities

### API Endpoints

#### Crisis Management
- `GET /api/crisis` - Get all crisis alerts (with optional filters)
- `POST /api/crisis` - Create a new crisis alert
- `PATCH /api/crisis/:id/status` - Update crisis alert status

#### Appointments
- `GET /api/appointments/student/:studentId` - Get appointments for a student
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments (admin)

## Features Implemented

### 1. Crisis Management Component

**New Features:**
- ✅ Real-time data fetching from API
- ✅ Search functionality (by student ID, type, source, keywords)
- ✅ Filter by status and severity
- ✅ Pagination (10 items per page)
- ✅ Real-time refresh (every 30 seconds)
- ✅ Optimistic updates for status changes
- ✅ Loading states and error handling
- ✅ Test buttons for API verification

**Search & Filter Options:**
- **Search**: Student ID, alert type, source, keywords
- **Status Filter**: Active, In Progress, Resolved
- **Severity Filter**: Critical, High, Medium, Low
- **Clear Filters**: Reset all filters

### 2. Appointment Booking Component

**New Features:**
- ✅ Real appointment creation via API
- ✅ Existing appointments display
- ✅ Time slot conflict detection
- ✅ Optimistic updates
- ✅ Loading states during submission
- ✅ Form validation and error handling

**Conflict Detection:**
- Automatically detects if a time slot is already booked
- Shows "(Booked)" indicator on conflicting slots
- Prevents double booking

## Usage Instructions

### Starting the Backend

1. Navigate to the backend directory:
   ```bash
   cd Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Testing the API Integration

1. **Test API Connection**: Click "Test API" button in Crisis Management
2. **Create Test Data**: Click "Create Test Alert" to add sample crisis alerts
3. **Check Console**: Open browser console to see API test results

### Using the Components

#### Crisis Management
1. Navigate to Crisis Management (Admin only)
2. Use search bar to find specific alerts
3. Use filters to narrow down results
4. Click on alerts to view details
5. Use action buttons to update status

#### Appointment Booking
1. Navigate to Appointment Booking (Student only)
2. Select appointment type (on-campus/online)
3. Choose date and time (conflicts are automatically detected)
4. Select counselor
5. Fill in details and book appointment

## API Response Formats

### Crisis Alert
```json
{
  "_id": "alert_id",
  "alertId": "CR-001",
  "severity": "critical|high|medium|low",
  "type": "suicide_risk|self_harm|severe_depression|panic_attack",
  "studentId": "ST-7823",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "ai_chat|forum_post|mood_tracker",
  "status": "active|in_progress|resolved",
  "aiConfidence": 97.8,
  "keywordsTrigger": ["end it all", "no way out"],
  "location": "Hostel Room 204, Block A",
  "previousAlerts": 0
}
```

### Appointment
```json
{
  "_id": "appointment_id",
  "student": "student_id",
  "counselor": "counselor_id",
  "institutionId": "institution_id",
  "appointmentType": "oncampus|online",
  "date": "2024-01-20T10:00:00Z",
  "timeSlot": "10:00 AM",
  "urgencyLevel": "routine|urgent|crisis",
  "reason": "Brief description",
  "status": "pending|confirmed|cancelled|completed"
}
```

## Error Handling

The API integration includes comprehensive error handling:

1. **Network Errors**: Automatic retry with user feedback
2. **Validation Errors**: Form validation with helpful messages
3. **Server Errors**: Graceful degradation with error states
4. **Loading States**: Visual feedback during API calls

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 5000
   - Check CORS configuration
   - Verify MongoDB connection

2. **No Data Loading**
   - Check browser console for errors
   - Verify API endpoints are correct
   - Test with the "Test API" button

3. **Search/Filter Not Working**
   - Clear browser cache
   - Check if filters are properly applied
   - Verify search term format

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Performance Optimizations

1. **Debounced Search**: 300ms delay to prevent excessive API calls
2. **Pagination**: Load only necessary data
3. **Optimistic Updates**: Immediate UI feedback
4. **Caching**: API responses cached for better performance
5. **Real-time Refresh**: Automatic data updates every 30 seconds

## Security Considerations

1. **Input Validation**: All user inputs are validated
2. **Error Sanitization**: Sensitive data not exposed in errors
3. **CORS**: Proper CORS configuration required
4. **Authentication**: User context required for protected routes

## Future Enhancements

1. **WebSocket Integration**: Real-time updates
2. **Offline Support**: Service worker for offline functionality
3. **Advanced Analytics**: Detailed reporting and insights
4. **Bulk Operations**: Mass update capabilities
5. **Export Features**: Data export functionality

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Test API endpoints manually
4. Verify backend server status
