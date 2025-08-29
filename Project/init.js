
// init.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

// Import Models
import User from "./models/usermodel.js";
import CrisisAlert from "./models/crisisAlertModel.js";
import Assessment from "./models/assessmentModel.js";
import Appointment from "./models/appointmentModel.js";
import Chat from "./models/aichatModel.js";
import Activity from "./models/activityLogModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // change DB name if needed

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Clear old data
    await Promise.all([
      User.deleteMany(),
      CrisisAlert.deleteMany(),
      Assessment.deleteMany(),
      Appointment.deleteMany(),
      Chat.deleteMany(),
      Activity.deleteMany(),
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

    // ---------------- ASSESSMENTS ----------------
    const assessments = [];
    for (let u of savedUsers) {
      const assessment = new Assessment({
        user: u._id,
        type: faker.helpers.arrayElement(["PHQ-9", "GAD-7", "GHQ-12"]),
        score: faker.number.int({ min: 0, max: 27 }),
        responses: Array.from({ length: 9 }, () =>
          faker.number.int({ min: 0, max: 3 })
        ),
      });
      assessments.push(assessment);
      u.assessments.push(assessment._id); // link back to user
      await u.save();
    }
    await Assessment.insertMany(assessments);
    console.log("Assessments inserted ✅");

    // ---------------- CRISIS ALERTS ----------------
    const crisisAlerts = savedUsers.map(
      (u) =>
        new CrisisAlert({
          alertId: faker.string.uuid(),
          severity: faker.helpers.arrayElement(["critical", "high", "medium"]),
          type: "suicidal_thoughts",
          studentId: u.studentId,
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
      u.appointments.push(appointment._id); // link back
      await u.save();
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
      const activity = new Activity({
        user: u._id,
        action: "login",
        metadata: { ip: faker.internet.ip() },
      });
      activities.push(activity);
      u.activityLogs.push(activity._id); // link back
      await u.save();
    }
    await Activity.insertMany(activities);
    console.log("Activities inserted ✅");

    console.log("Seeding completed 🎉");
    process.exit();
  } catch (err) {
    console.error("Error seeding data ❌", err);
    process.exit(1);
  }
}

seed();
