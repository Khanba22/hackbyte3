"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, UserRound, Building2, FileText } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchData } from "@/lib/fetchData"

type Doctor = {
  _id: string
  full_name: string
  department: string
  specialty: string
  experience: number
  phone: string
  available_time_slots: {
    _id: string
    day_of_week: string
    start_time: string
    end_time: string
  }[]
}

type Hospital = {
  _id: string
  name: string
  address: string
  city: string
  state: string
  specialty: string
  bed_total: number
  bed_available: number
  is_icu_available: boolean
  icu_total: number
  icu_available: number
  phone: string
  image: string
  rating: number
  email: string
  established: boolean
}

type AppointmentForm = {
  hospitalId: string
  department: string
  doctorId: string
  timeSlot: string
  appointmentDate: Date | undefined
  symptoms: string
}

export default function AppointmentBookingPage() {
  const router = useRouter()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [availableSlots, setAvailableSlots] = useState<{ day_of_week: string; start_time: string; end_time: string }[]>(
    [],
  )
  const [step, setStep] = useState<number>(1) // 1: Department, 2: Doctor, 3: Date & Time, 4: Symptoms

  const [form, setForm] = useState<AppointmentForm>({
    hospitalId: "",
    department: "",
    doctorId: "",
    timeSlot: "",
    appointmentDate: undefined,
    symptoms: "",
  })

  const fetchHospitalData = async () => {
    try {
      const hospitalId = window.location.pathname.split("/").pop()
      const { hospital, staff } = await fetchData({
        url: `/hospital/${hospitalId}`,
      })

      setHospital(hospital)
      setDoctors(staff)

      // Extract unique departments from staff data
      const uniqueDepartments = Array.from(new Set(staff.map((doctor: Doctor) => doctor.department))) as string[]
      setDepartments(uniqueDepartments)

      setForm((prev) => ({ ...prev, hospitalId: hospitalId || "" }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchHospitalData()
  }, [])

  // Filter doctors when department changes
  useEffect(() => {
    if (form.department) {
      const doctorsInDepartment = doctors.filter((doctor) => doctor.department === form.department)
      setFilteredDoctors(doctorsInDepartment)
      // Reset doctor selection and time slot when department changes
      setForm((prev) => ({ ...prev, doctorId: "", timeSlot: "", appointmentDate: undefined }))
      setAvailableSlots([])
      setStep(2) // Move to doctor selection
    }
  }, [form.department, doctors])

  // Update available time slots when doctor changes
  useEffect(() => {
    if (form.doctorId) {
      const selectedDoctor = doctors.find((doc) => doc._id === form.doctorId)
      if (selectedDoctor) {
        const slots = selectedDoctor.available_time_slots.map((slot) => ({
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }))
        setAvailableSlots(slots)
        // Reset time slot when doctor changes
        setForm((prev) => ({ ...prev, timeSlot: "", appointmentDate: undefined }))
        setStep(3) // Move to date & time selection
      }
    }
  }, [form.doctorId, doctors])

  // When appointment date changes, filter time slots that match the day of week
  const getAvailableSlotsForDate = () => {
    if (!form.appointmentDate) return []

    const dayOfWeek = format(form.appointmentDate, "EEEE")
    return availableSlots.filter((slot) => slot.day_of_week.toLowerCase() === dayOfWeek.toLowerCase())
  }

  const handleSelectDepartment = (department: string) => {
    setForm((prev) => ({ ...prev, department }))
  }

  const handleSelectDoctor = (doctorId: string) => {
    setForm((prev) => ({ ...prev, doctorId }))
  }

  const handleSelectTimeSlot = (timeSlot: string) => {
    setForm((prev) => ({ ...prev, timeSlot }))
    setStep(4) // Move to symptoms
  }

  const handleDateChange = (date: Date | undefined) => {
    setForm((prev) => ({ ...prev, appointmentDate: date, timeSlot: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.department || !form.doctorId || !form.timeSlot || !form.appointmentDate || !form.symptoms) {
      // alert("Please fill in all fields.");
      return
    }

    const appointmentData = {
      ...form,
      appointmentDate: form.appointmentDate ? format(form.appointmentDate, "yyyy-MM-dd") : "",
    }

    console.log("Appointment Data:", appointmentData)

    alert("Appointment booked successfully!")
    router.push(`/booking/confirmation`)
  }

  if (!hospital) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="animate-pulse text-lg font-medium text-slate-400">Loading hospital details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="shadow-lg border-0 overflow-hidden bg-slate-800 text-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-700">
            <CardTitle className="text-2xl flex items-center text-white">
              <Building2 className="mr-2 h-6 w-6" />
              Book Appointment at {hospital.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-400" : "text-slate-500"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-blue-400 bg-slate-700" : "border-slate-600"}`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Department</span>
                </div>
                <div className={`h-1 flex-1 mx-2 ${step >= 2 ? "bg-blue-500" : "bg-slate-600"}`}></div>
                <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-400" : "text-slate-500"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-blue-400 bg-slate-700" : "border-slate-600"}`}
                  >
                    <UserRound className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Doctor</span>
                </div>
                <div className={`h-1 flex-1 mx-2 ${step >= 3 ? "bg-blue-500" : "bg-slate-600"}`}></div>
                <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-400" : "text-slate-500"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-blue-400 bg-slate-700" : "border-slate-600"}`}
                  >
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Schedule</span>
                </div>
                <div className={`h-1 flex-1 mx-2 ${step >= 4 ? "bg-blue-500" : "bg-slate-600"}`}></div>
                <div className={`flex flex-col items-center ${step >= 4 ? "text-blue-400" : "text-slate-500"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 4 ? "border-blue-400 bg-slate-700" : "border-slate-600"}`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Confirm</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Department Selection */}
              <div className={step === 1 ? "block" : "hidden"}>
                <h3 className="text-xl font-semibold mb-6 text-slate-200">Select Department</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      className={`cursor-pointer border rounded-xl p-5 transition-all duration-200 transform hover:scale-102 hover:shadow-md ${
                        form.department === dept
                          ? "bg-slate-700 border-blue-500 shadow-md"
                          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }`}
                      onClick={() => handleSelectDepartment(dept)}
                    >
                      <div
                        className={`font-medium text-center ${form.department === dept ? "text-blue-300" : "text-slate-300"}`}
                      >
                        {dept}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Doctor Selection */}
              <div className={step === 2 ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-200">Select Doctor</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="border-slate-600 text-blue-400 hover:bg-slate-700"
                  >
                    Back
                  </Button>
                </div>
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className={`cursor-pointer border rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
                        form.doctorId === doctor._id
                          ? "bg-slate-700 border-blue-500 shadow-md"
                          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }`}
                      onClick={() => handleSelectDoctor(doctor._id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div
                            className={`font-semibold text-lg ${form.doctorId === doctor._id ? "text-blue-300" : "text-slate-200"}`}
                          >
                            Dr. {doctor.full_name}
                          </div>
                          <div className={`${form.doctorId === doctor._id ? "text-blue-400" : "text-slate-400"}`}>
                            {doctor.specialty}
                          </div>
                          <div
                            className={`text-sm ${form.doctorId === doctor._id ? "text-blue-500" : "text-slate-500"}`}
                          >
                            {doctor.experience} years experience
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            form.doctorId === doctor._id ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          <UserRound className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Date and Time Selection */}
              <div className={step === 3 ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-200">Schedule Appointment</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="border-slate-600 text-blue-400 hover:bg-slate-700"
                  >
                    Back
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div className="p-4 rounded-xl shadow-sm border border-slate-700 bg-slate-800">
                    <h4 className="text-md font-medium mb-4 text-slate-200">Select Date</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-slate-600 hover:border-blue-500 hover:bg-slate-700"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                          {form.appointmentDate ? (
                            format(form.appointmentDate, "PPP")
                          ) : (
                            <span className="text-slate-400">Select a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-slate-600 bg-slate-800">
                        <Calendar
                          mode="single"
                          selected={form.appointmentDate}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => {
                            // Disable past dates and weekends
                            const dayOfWeek = format(date, "EEEE")
                            const isWeekend = dayOfWeek === "Saturday" || dayOfWeek === "Sunday"
                            return date < new Date() || isWeekend
                          }}
                          className="rounded-md border-slate-600 bg-slate-800 text-slate-200"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slots */}
                  <div className="p-4 rounded-xl shadow-sm border border-slate-700 bg-slate-800">
                    <h4 className="text-md font-medium mb-4 text-slate-200">Select Time</h4>
                    {!form.appointmentDate ? (
                      <div className="text-sm text-slate-400 p-4 bg-slate-700 rounded-lg border border-slate-600 text-center">
                        Please select a date first
                      </div>
                    ) : getAvailableSlotsForDate().length === 0 ? (
                      <div className="text-sm text-slate-400 p-4 bg-slate-700 rounded-lg border border-slate-600 text-center">
                        No available slots for this date
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {getAvailableSlotsForDate().map((slot, idx) => (
                          <div
                            key={idx}
                            className={`cursor-pointer rounded-lg p-3 text-center transition-all ${
                              form.timeSlot === `${slot.start_time}-${slot.end_time}`
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-500"
                            }`}
                            onClick={() => handleSelectTimeSlot(`${slot.start_time}-${slot.end_time}`)}
                          >
                            {slot.start_time} - {slot.end_time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Symptoms */}
              <div className={step === 4 ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-200">Finalize Appointment</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(3)}
                    className="border-slate-600 text-blue-400 hover:bg-slate-700"
                  >
                    Back
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-700 rounded-xl p-5 border border-slate-600">
                    <h4 className="font-medium text-blue-300 mb-3">Appointment Summary</h4>
                    <div className="space-y-2 text-slate-300">
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Department:</p>
                        <p>{form.department}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Doctor:</p>
                        <p>Dr. {filteredDoctors.find((d) => d._id === form.doctorId)?.full_name}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Date:</p>
                        <p>{form.appointmentDate ? format(form.appointmentDate, "PPP") : ""}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Time:</p>
                        <p>{form.timeSlot}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Visit / Symptoms</label>
                    <Textarea
                      placeholder="Please describe your symptoms or reason for visit..."
                      value={form.symptoms}
                      onChange={(e) => setForm((prev) => ({ ...prev, symptoms: e.target.value }))}
                      className="min-h-[120px] text-slate-200 resize-none bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-25"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium transition-all"
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

