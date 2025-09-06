import mongoose from "mongoose";
import fs from "fs";
import Appointment from "../models/appointmentModel.js"; // adjust your model path
import CrisisAlert from "../models/crisisAlertModel.js";
import assessmentModels from "../models/assessmentModel.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
// connect to mongo
await mongoose.connect(MONGO_URI);

try {
    await Appointment.deleteMany({});
    console.log("All existing appointments deleted.");
    await CrisisAlert.deleteMany({});
    console.log("All existing crisis alerts deleted.");
    await assessmentModels.Assessment.deleteMany({});
    console.log("All existing assessments deleted.");
    // Read JSON file
    const appointments = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'jsonFiles', 'appointments_sample.json'), "utf-8"));
    const crisisAlerts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'jsonFiles', 'crisis_alerts.json'), "utf-8"));
    const allAssessments = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'jsonFiles', 'synthetic_mental_health_data.json'), "utf-8"));
    
    // Filter assessments to only include supported types (PHQ-9 and GAD-7)
    const assessments = allAssessments.filter(assessment => 
      assessment.type === 'PHQ-9' || assessment.type === 'GAD-7'
    );
    
    console.log(`Filtered assessments: ${allAssessments.length} total, ${assessments.length} valid`);
    // Insert into DB
    const result = await Appointment.insertMany(appointments);
    console.log("Appointments inserted successfully:", result.length);

    const crisisResult = await CrisisAlert.insertMany(crisisAlerts);
    console.log("Crisis alerts inserted successfully:", crisisResult.length);

    const assessmentResult = await assessmentModels.Assessment.insertMany(assessments);
    console.log("Assessments inserted successfully:", assessmentResult.length);

   
} catch (err) {
    console.error("Error inserting appointments:", err);
}

mongoose.connection.close();

