import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/User";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";
import Hospital from "../models/Hospital";
import Appointment from "../models/Appointment";
import TimeSlot from "../models/TimeSlot";

// Define interfaces
interface IDoctors {
    _id:mongoose.Schema.Types.ObjectId;
    user: string;
    full_name: string;
    hospital: string;
    department: string;
    specialty: string;
    experience: number;
    phone: string;
    available_time_slots: mongoose.Schema.Types.ObjectId[];
}

// Generate Users
const generateUsers = async (count: number) => {
    const users = Array.from({ length: count }, () => ({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        isPasswordSet: true,
        role: Math.random() > 0.5 ? "doctor" : "patient"
    }));

    return await User.insertMany(users);
};

// Generate Doctors
const generateDoctors = async (users: any[], hospitals: any[]) => {
    let doctors: IDoctors[] = [];

    for (const user of users.filter(user => user.role === "doctor")) {
        let hospital = faker.helpers.arrayElement(hospitals);

        let doctor = await Doctor.create({
            user: user._id,
            full_name: user.username,
            hospital: hospital._id,
            department: faker.helpers.arrayElement(["Cardiology", "Neurology", "Orthopedics", "Pediatrics"]),
            specialty: faker.helpers.arrayElement(["Heart Surgeon", "Brain Specialist", "Bone Specialist", "Child Specialist"]),
            experience: faker.number.int({ min: 2, max: 30 }),
            phone: faker.phone.number(),
            available_time_slots: []
        });

        let timeSlots = await generateTimeSlots(doctor._id);
        doctor.available_time_slots = timeSlots;
        await doctor.save();

        doctors.push(doctor);
    }

    return doctors;
};

// Generate Patients
const generatePatients = async (users: any[]) => {
    const patients = users.filter(user => user.role === "patient").map(user => ({
        user: user._id,
        full_name: user.username,
        phone: faker.phone.number(),
        date_of_birth: faker.date.past({ years: 30 }),
        weight: faker.number.int({ min: 40, max: 100 }),
        height: faker.number.int({ min: 140, max: 200 }),
        blood_group: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state()
    }));

    return await Patient.insertMany(patients);
};

// Generate Time Slots
const generateTimeSlots = async (doctorId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Schema.Types.ObjectId[]> => {
    const slots = [];
    const startHours = [8, 9, 10, 14, 15, 16];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (let i = 0; i < 5; i++) {
        let start = faker.helpers.arrayElement(startHours);
        let end = start + 1;

        let slot = new TimeSlot({
            day_of_week: days[i],
            start_time: `${start}:00`,
            end_time: `${end}:00`,
        });

        const savedSlot = await slot.save();
        slots.push(savedSlot._id);
    }

    return slots;
};

// Generate Appointments
export const generateAppointments = async (doctors: any[], patients: any[]) => {
    let appointments: any[] = [];

    for (let i = 0; i < 500; i++) {
        let doctor = faker.helpers.arrayElement(doctors);
        let patient = faker.helpers.arrayElement(patients);

        if (!doctor.available_time_slots.length) continue;

        let randomDate = new Date();
        randomDate.setDate(randomDate.getDate() + faker.number.int({ min: 1, max: 5 }));
        let timeSlot = faker.helpers.arrayElement(doctor.available_time_slots);
        let appointmentDateTime = `${randomDate.toISOString().split("T")[0]} ${timeSlot}`;

        const isDuplicate = appointments.some(a =>
            a.doctor.toString() === doctor._id.toString() &&
            a.timeSlot === timeSlot &&
            a.date === appointmentDateTime
        );

        if (!isDuplicate) {
            appointments.push({
                doctor: doctor._id,
                patient: patient._id,
                appointmentDate:randomDate.toDateString(),
                timeSlot: timeSlot,
                date: appointmentDateTime,
                hospital: doctor.hospital,
                status: faker.helpers.arrayElement(["pending", "confirmed", "cancelled", "completed", "scheduled"])
            });
        }
    }

    return await Appointment.insertMany(appointments);
};
// Main Function
const seedDatabase = async () => {
    try {
        console.log("🔄 Clearing existing data...");
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        // await Appointment.deleteMany({});
        await TimeSlot.deleteMany({});

        console.log("🏥 Fetching hospitals...");
        const hospitals = await Hospital.find();
        if (hospitals.length === 0) {
            console.log("⚠️ No hospitals found! Add hospitals first.");
            return;
        }

        console.log("👤 Creating users...");
        const users = await generateUsers(100);

        console.log("🩺 Assigning doctors...");
        const doctors = await generateDoctors(users, hospitals);

        console.log("🏥 Assigning patients...");
        const patients = await generatePatients(users);

        console.log("📅 Generating appointments...");
        await generateAppointments(doctors, patients);

        console.log("✅ Database populated successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error populating database:", error);
    }
};

// Run the script
export default seedDatabase;
