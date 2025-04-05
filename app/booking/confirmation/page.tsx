"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, CalendarDays, Hospital, Clock, FileText } from "lucide-react"

// Simulated Appointment Data (In a real app, fetch from backend)
const mockAppointment = {
  hospitalName: "Memorial General Hospital",
  specialization: "Cardiology",
  timeSlot: "Monday: 10:00 AM - 11:00 AM",
  symptoms: "Chest pain, shortness of breath",
}

export default function AppointmentConfirmation() {
  const router = useRouter()
  const [appointment, setAppointment] = useState<any>(null)

  useEffect(() => {
    // Simulating fetching appointment details
    setTimeout(() => setAppointment(mockAppointment), 1000)
  }, [])

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen text-lg bg-slate-900 text-slate-300">
        Loading confirmation details...
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900">
      <Card className="w-full max-w-lg shadow-lg rounded-lg p-6 animate-fade-in bg-slate-800 border-slate-700">
        {/* Success Message */}
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="text-emerald-400 w-16 h-16 animate-bounce mb-4" />
          <h2 className="text-2xl font-bold text-slate-200">Appointment Confirmed!</h2>
          <p className="text-slate-400">Your appointment has been successfully booked.</p>
        </div>

        {/* Appointment Details */}
        <CardContent className="mt-6 space-y-4 bg-slate-700 rounded-xl p-5 border border-slate-600">
          <div className="flex items-center gap-3">
            <Hospital className="text-blue-400 w-6 h-6" />
            <span className="font-medium text-slate-200">{appointment.hospitalName}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="text-amber-400 w-6 h-6" />
            <span className="font-medium text-slate-200">{appointment.specialization}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-purple-400 w-6 h-6" />
            <span className="font-medium text-slate-200">{appointment.timeSlot}</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="text-rose-400 w-6 h-6" />
            <span className="font-medium text-slate-200">{appointment.symptoms}</span>
          </div>
        </CardContent>

        {/* Actions */}
        <div className="mt-6 flex flex-col space-y-3">
          <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Return to Homepage
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/appointments")}
            className="w-full border-slate-600 text-blue-400 hover:bg-slate-700"
          >
            View Appointments
          </Button>
        </div>
      </Card>
    </div>
  )
}

