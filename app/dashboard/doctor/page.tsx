"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorDashboardLayout } from '@/components/layouts/doctor-dashboard-layout';
import { PatientList } from '@/components/patient-list';
import { MessageForm } from '@/components/message-form';
import { fetchData } from '@/lib/fetchData';

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'doctor') {
      router.push('/auth/login');
      return;
    }
    fetchDoctorDetails();
    fetchPatients();
  }, [isAuthenticated, router, user?.role]);

  const fetchDoctorDetails = async () => {
    try {
      const data = await fetchData({ url: `/doctor/${user?._id}` });
      setDoctorDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await fetchData({ url: '/api/patients', method: 'GET' });
      setPatients(data.patients);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated || user?.role !== 'doctor') {
    return null;
  }

  return (
    <DoctorDashboardLayout>
      <div className="flex flex-col gap-6">
        {doctorDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Dr. {doctorDetails.full_name}</CardTitle>
              <CardDescription>{doctorDetails.specialty} - {doctorDetails.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Experience: {doctorDetails.experience} years</p>
              <p>Phone: {doctorDetails.phone}</p>
              <p>Hospital: {doctorDetails.hospital.name} ({doctorDetails.hospital.city})</p>
            </CardContent>
          </Card>
        )}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>Your scheduled working hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {doctorDetails?.available_time_slots?.map((slot:any) => (
                  <div key={slot._id} className="border p-2 rounded-md mb-2">
                    {slot.day_of_week}: {slot.start_time} - {slot.end_time}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Patients</CardTitle>
                <CardDescription>Manage your patient list.</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientList patients={patients} onSelectPatient={setSelectedPatient} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Communicate with your patients.</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageForm patients={patients} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorDashboardLayout>
  );
}
