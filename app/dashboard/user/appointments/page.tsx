"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { fetchData } from "@/lib/fetchData";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  const { user } = useAuth();

  const fetchAppointments = async () => {
    try {
      const data = await fetchData({
        url: `/appointment/get-patient-appointment/${user?._id}`,
      });
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;
    if (statusFilter) {
      filtered = filtered.filter((appt) => appt.status === statusFilter);
    }
    if (hospitalFilter) {
      filtered = filtered.filter((appt) => appt.hospital.name === hospitalFilter);
    }
    if (doctorFilter) {
      filtered = filtered.filter((appt) => appt.doctor.full_name === doctorFilter);
    }
    setFilteredAppointments(filtered);
  }, [statusFilter, hospitalFilter, doctorFilter, appointments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <select onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select onChange={(e) => setHospitalFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Hospitals</option>
            {Array.from(new Set(appointments.map((appt) => appt.hospital.name))).map((hospital) => (
              <option key={hospital} value={hospital}>{hospital}</option>
            ))}
          </select>
          <select onChange={(e) => setDoctorFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Doctors</option>
            {Array.from(new Set(appointments.map((appt) => appt.doctor.full_name))).map((doctor) => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="p-4 border rounded-md mb-2">
              <p className="font-medium">
                Dr. {appointment.doctor.full_name} ({appointment.doctor.specialty})
              </p>
              <p className="text-sm text-muted-foreground">Date: {appointment.appointmentDate}</p>
              <p className="text-sm text-muted-foreground">
                Hospital: {appointment.hospital.name} - {appointment.hospital.address}
              </p>
              <p className="text-sm text-muted-foreground">Status: {appointment.status}</p>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;