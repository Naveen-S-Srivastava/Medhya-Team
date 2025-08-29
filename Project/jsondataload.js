import mongoose from "mongoose";
import fs from "fs";
import Appointment from "./models/appointmentModel.js"; // adjust your model path
import crisisAlertModel from "./models/crisisAlertModel.js";

import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
// connect to mongo
await mongoose.connect(MONGO_URI);

try {
    await Appointment.deleteMany({});
    console.log("All existing appointments deleted.");
    await crisisAlertModel.deleteMany({});
    console.log("All existing crisis alerts deleted.");
    // Read JSON file
    const appointments = JSON.parse(fs.readFileSync("json_files/appointments_sample.json", "utf-8"));
    const crisisAlerts = JSON.parse(fs.readFileSync("json_files/crisis_alerts.json", "utf-8"));

    // Insert into DB
    const result = await Appointment.insertMany(appointments);
    console.log("Appointments inserted successfully:", result.length);

    const crisisResult = await crisisAlertModel.insertMany(crisisAlerts);
    console.log("Crisis alerts inserted successfully:", crisisResult.length);

} catch (err) {
    console.error("Error inserting appointments:", err);
}

mongoose.connection.close();

