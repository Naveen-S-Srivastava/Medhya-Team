
// init.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Models
import User from "../models/usermodel.js"
import CrisisAlert from "../models/crisisAlertModel.js";
import assessmentModels from "../models/assessmentModel.js";
import Appointment from "../models/appointmentModel.js";
import Chat from "../models/aichatModel.js";
import ActivityLog from "../models/activityLogModel.js";
import JournalEntry from "../models/journalModel.js";

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI; // change DB name if needed

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Clear old data
    await Promise.all([
      User.deleteMany(),
      CrisisAlert.deleteMany(),
      assessmentModels.Assessment.deleteMany(),
      Appointment.deleteMany(),
      Chat.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    console.log("Old data cleared 🗑️");

    // ---------------- USERS ----------------
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push(
        new User({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 25, mode: "age" }),
          gender: faker.helpers.arrayElement(["male", "female", "other"]),
          institutionId: faker.string.uuid(),
          studentId: faker.string.alphanumeric(8),
          course: faker.word.noun(),
          year: `${faker.number.int({ min: 1, max: 4 })}`,
          department: faker.word.noun(),
          password: "password123", // gets hashed in pre-save hook
          securityQuestion: "What is your favorite color?",
          securityAnswer: "Blue",
          privacyConsent: true,
          dataProcessingConsent: true,
          emergencyContact: faker.person.fullName(),
          emergencyPhone: faker.phone.number(),
          mentalHealthConsent: true,
          communicationConsent: faker.datatype.boolean(),
          role: "student",
        })
      );
    }

    const savedUsers = await User.insertMany(users);
    console.log("Users inserted ✅");

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mindcare.com',
      password: 'admin123',
      phone: '1234567890',
      institutionId: 'ADMIN001',
      studentId: 'ADMIN001',
      course: 'Administration',
      year: '1',
      department: 'IT',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'Blue',
      privacyConsent: true,
      dataProcessingConsent: true,
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '1234567890',
      mentalHealthConsent: true,
      communicationConsent: true,
      role: 'admin',
      isEmailVerified: true,
      isVerified: true
    });

    await adminUser.save();
    console.log("Admin user created ✅");
    console.log("Email: admin@mindcare.com");
    console.log("Password: admin123");

    // ---------------- ASSESSMENTS ----------------
    const assessments = [];
    for (let u of savedUsers) {
      const assessment = new assessmentModels.Assessment({
        user: u._id,
        type: faker.helpers.arrayElement(["PHQ-9", "GAD-7"]),
        score: faker.number.int({ min: 0, max: 27 }),
        responses: Array.from({ length: 9 }, () =>
          faker.number.int({ min: 0, max: 3 })
        ),
      });
      assessments.push(assessment);
      // u.assessments.push(assessment._id); // link back to user - removed as field not in model
      // await u.save();
    }
    await assessmentModels.Assessment.insertMany(assessments);
    console.log("Assessments inserted ✅");

    // ---------------- CRISIS ALERTS ----------------
    const crisisAlerts = savedUsers.map(
      (u) =>
        new CrisisAlert({
          alertId: faker.string.uuid(),
          severity: faker.helpers.arrayElement(["critical", "high", "medium"]),
          type: "suicidal_thoughts",
          studentId: u.studentId || 'TEST123',
          source: faker.helpers.arrayElement([
            "ai_chat",
            "forum_post",
            "mood_tracker",
          ]),
          aiConfidence: faker.number.int({ min: 60, max: 99 }),
          keywordsTrigger: ["sad", "depressed"],
          previousAlerts: faker.number.int({ min: 0, max: 3 }),
        })
    );
    await CrisisAlert.insertMany(crisisAlerts);
    console.log("Crisis Alerts inserted ✅");

    // ---------------- APPOINTMENTS ----------------
    const appointments = [];
    for (let u of savedUsers.slice(0, 3)) {
      const appointment = new Appointment({
        student: u._id,
        counselor: savedUsers[0]._id, // assign first user as counselor
        institutionId: new mongoose.Types.ObjectId(),
        appointmentType: faker.helpers.arrayElement(["oncampus", "online"]),
        date: faker.date.future(),
        timeSlot: "10:00-11:00 AM",
        urgencyLevel: faker.helpers.arrayElement([
          "routine",
          "urgent",
          "crisis",
        ]),
        reason: faker.lorem.sentence(),
      });
      appointments.push(appointment);
      // u.appointments.push(appointment._id); // link back
      // await u.save();
    }
    await Appointment.insertMany(appointments);
    console.log("Appointments inserted ✅");

    // ---------------- CHATS ----------------
    const chats = [];
    for (let u of savedUsers) {
      const chat = new Chat({
        user: u._id,
        sessionId: faker.string.uuid(),
        messages: [
          {
            sender: "user",
            content: "I feel stressed",
            type: "normal",
          },
          {
            sender: "ai",
            content: "I’m here to support you.",
            type: "suggestion",
          },
        ],
      });
      chats.push(chat);
    }
    await Chat.insertMany(chats);
    console.log("Chats inserted ✅");

    // ---------------- ACTIVITY LOGS ----------------
    const activities = [];
    for (let u of savedUsers) {
      const activity = new ActivityLog({
        user: u._id,
        action: "login",
        metadata: { ip: faker.internet.ip() },
      });
      activities.push(activity);
      // u.activityLogs.push(activity._id); // link back
      // await u.save();
    }
    await ActivityLog.insertMany(activities);
    console.log("Activities inserted ✅");

    // ---------------- JOURNAL ENTRIES ----------------
    const journalEntries = [];
    for (let u of savedUsers.filter(u => u.role === 'student')) {
      // Create 3-5 journal entries per student
      const numEntries = faker.number.int({ min: 3, max: 5 });
      for (let i = 0; i < numEntries; i++) {
        const entry = new JournalEntry({
          user: u._id,
          content: faker.lorem.paragraphs(2),
          mood: faker.helpers.arrayElement(['happy', 'neutral', 'sad', 'anxious', 'stressed']),
          moodScore: faker.number.int({ min: 1, max: 10 }),
          tags: faker.helpers.arrayElements(['productive', 'grateful', 'exercise', 'social', 'academic', 'stress'], { min: 1, max: 3 }),
          wellnessScore: faker.number.int({ min: 50, max: 100 }),
          sleepHours: faker.number.float({ min: 4, max: 12, precision: 0.5 }),
          stressLevel: faker.number.int({ min: 1, max: 10 }),
          activities: faker.helpers.arrayElements(['studying', 'exercise', 'socializing', 'reading', 'meditation'], { min: 1, max: 3 }),
          gratitude: faker.helpers.arrayElements(['Good health', 'Supportive friends', 'Academic progress', 'Family'], { min: 1, max: 3 }),
          goals: faker.helpers.arrayElements(['Complete project', 'Exercise regularly', 'Study more', 'Sleep better'], { min: 1, max: 3 }),
          challenges: faker.helpers.arrayElements(['Time management', 'Stress', 'Procrastination'], { min: 0, max: 2 }),
          achievements: faker.helpers.arrayElements(['Finished assignment', 'Went for a run', 'Helped a friend'], { min: 0, max: 2 }),
          createdAt: faker.date.recent({ days: 30 })
        });
        journalEntries.push(entry);
      }
    }
    await JournalEntry.insertMany(journalEntries);
    console.log("Journal entries inserted ✅");

    console.log("Seeding completed 🎉");
    process.exit();
  } catch (err) {
    console.error("Error seeding data ❌", err);
    process.exit(1);
  }
}

seed();
