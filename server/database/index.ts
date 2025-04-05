import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect("mongodb://localhost:27017/mini_project_hospital");

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

export default connectToDB;
