import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('🧪 Testing Appointment APIs...\n');

  try {
    // Test 1: Get all counselors
    console.log('1. Testing GET /api/counselors');
    const counselorsResponse = await fetch(`${BASE_URL}/counselors`);
    const counselorsData = await counselorsResponse.json();
    console.log(`✅ Status: ${counselorsResponse.status}`);
    console.log(`📊 Found ${counselorsData.data?.length || 0} counselors\n`);

    if (counselorsData.data && counselorsData.data.length > 0) {
      const firstCounselor = counselorsData.data[0];
      console.log(`👤 First counselor: ${firstCounselor.name} (${firstCounselor._id})`);
      console.log(`📅 Appointment type: ${firstCounselor.appointmentType}`);
      console.log(`🏷️ Specializations: ${firstCounselor.specialization.join(', ')}\n`);

      // Test 2: Get available slots for first counselor on Monday (if available)
      console.log('2. Testing GET /api/counselors/:id/availability');
      
      // Find next Monday
      const today = new Date();
      const daysUntilMonday = (8 - today.getDay()) % 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      const mondayStr = nextMonday.toISOString().split('T')[0];
      
      console.log(`📅 Testing with date: ${mondayStr} (${nextMonday.toLocaleDateString('en-US', { weekday: 'long' })})`);
      
      const slotsResponse = await fetch(`${BASE_URL}/counselors/${firstCounselor._id}/availability?date=${mondayStr}`);
      const slotsData = await slotsResponse.json();
      console.log(`✅ Status: ${slotsResponse.status}`);
      console.log(`⏰ Available slots: ${slotsData.data?.length || 0}`);
      
      if (slotsData.data && slotsData.data.length > 0) {
        console.log(`🕐 First slot: ${slotsData.data[0].timeSlot}`);
      }
      console.log('');

      // Test 3: Get appointments for student (should return empty array for demo student)
      console.log('3. Testing GET /api/appointments/student/:studentId');
      const appointmentsResponse = await fetch(`${BASE_URL}/appointments/student/demo-student-123`);
      const appointmentsData = await appointmentsResponse.json();
      console.log(`✅ Status: ${appointmentsResponse.status}`);
      console.log(`📋 Appointments found: ${appointmentsData.length || 0}\n`);

      // Test 4: Create a test appointment
      console.log('4. Testing POST /api/appointments (Create appointment)');
      const appointmentData = {
        student: 'demo-student-123',
        counselor: firstCounselor._id,
        institutionId: 'demo-institution-123',
        appointmentType: 'oncampus',
        date: mondayStr,
        timeSlot: '09:00 - 10:00',
        urgencyLevel: 'routine',
        reason: 'Test appointment for API verification',
        status: 'pending'
      };

      const createResponse = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      if (createResponse.ok) {
        const createdAppointment = await createResponse.json();
        console.log(`✅ Status: ${createResponse.status}`);
        console.log(`📝 Created appointment ID: ${createdAppointment._id}`);
        console.log(`📅 Date: ${createdAppointment.date}`);
        console.log(`⏰ Time: ${createdAppointment.timeSlot}\n`);

        // Test 5: Get appointments again (should now show the created appointment)
        console.log('5. Testing GET /api/appointments/student/:studentId (After creation)');
        const updatedAppointmentsResponse = await fetch(`${BASE_URL}/appointments/student/demo-student-123`);
        const updatedAppointmentsData = await updatedAppointmentsResponse.json();
        console.log(`✅ Status: ${updatedAppointmentsResponse.status}`);
        console.log(`📋 Appointments found: ${updatedAppointmentsData.length || 0}`);
        
        if (updatedAppointmentsData.length > 0) {
          console.log(`📝 Latest appointment: ${updatedAppointmentsData[0].date} at ${updatedAppointmentsData[0].timeSlot}`);
        }
        console.log('');
      } else {
        console.log(`❌ Failed to create appointment: ${createResponse.status}`);
        const errorData = await createResponse.json();
        console.log(`Error: ${JSON.stringify(errorData)}\n`);
      }

    } else {
      console.log('❌ No counselors found in database');
    }

    // Test 6: Test counselor search functionality
    console.log('6. Testing counselor search');
    const searchResponse = await fetch(`${BASE_URL}/counselors?search=anxiety`);
    const searchData = await searchResponse.json();
    console.log(`✅ Status: ${searchResponse.status}`);
    console.log(`🔍 Search results for "anxiety": ${searchData.data?.length || 0} counselors`);
    
    if (searchData.data && searchData.data.length > 0) {
      console.log(`👥 Found counselors: ${searchData.data.map(c => c.name).join(', ')}`);
    }
    console.log('');

    // Test 7: Test counselor filtering by appointment type
    console.log('7. Testing counselor filtering by appointment type');
    const filterResponse = await fetch(`${BASE_URL}/counselors?appointmentType=online`);
    const filterData = await filterResponse.json();
    console.log(`✅ Status: ${filterResponse.status}`);
    console.log(`💻 Online counselors: ${filterData.data?.length || 0}`);
    
    if (filterData.data && filterData.data.length > 0) {
      console.log(`👥 Online counselors: ${filterData.data.map(c => c.name).join(', ')}`);
    }
    console.log('');

    console.log('🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
  }
}

// Run the tests
testAPIs();
