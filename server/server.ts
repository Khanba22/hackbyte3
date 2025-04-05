import "dotenv/config";
import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectToDB from "./database";
import authRoute from "./routes/auth"
import hospitalRoute from "./routes/hospital"
import appointmentRoute from "./routes/appointment"
import patientRoute from "./routes/patient"
import doctorRoutes from "./routes/doctor"
import seedDatabase from "./utils/populateDatabase";





const app = express();
const server = createServer(app);
const PORT = 3001;
connectToDB()
app.use(cors())
app.use(express.json()); // ✅ Add this line
app.use(express.urlencoded({ extended: true })); // Optional: For URL-encoded form data

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Allow Next.js frontend
    methods: ["GET", "POST"]
  }
});
// seedDatabase()

app.get("/",(req,res)=>{
  res.send(`Server Active On Port ${PORT}`)
})

app.use("/auth",authRoute)
app.use("/hospital",hospitalRoute)
app.use("/appointment",appointmentRoute)
app.use("/doctor",doctorRoutes)
app.use("/patient",patientRoute)


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Received:", msg);
    io.emit("message", msg);  // Broadcast message
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Socket.o Server running on http://localhost:${PORT}`);
});

