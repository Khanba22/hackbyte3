"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDashboardLayout } from "@/components/layouts/user-dashboard-layout";
import { HospitalCard } from "@/components/hospital-card";
import { RecommendationForm } from "@/components/recommendation-form";
import { fetchData } from "@/lib/fetchData";

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [recentHospitals, setRecentHospitals] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patient, setPatient] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    weight: 60,
    height: 195,
    blood_group: "A-",
    address: "",
    city: "",
    state: "",
  });

  const fetchPatientDetails = async () => {
    console.log("Fetching User Details");
    if (!user?._id) return; // Prevent API call if user ID is not available
    console.log(`Fetching User Data with id ${user._id}`);
    try {
      const { patient, appointments } = await fetchData({
        url: `/patient/${user._id}`,
        method: "GET",
      });
      console.log(JSON.stringify({ patient, appointments }));
      setPatient(patient);
      setAppointments(appointments);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const fetchRecentHospitals = async () => {
    try {
      const data = await fetchData({
        url: `/patient/${user?._id}/recent-hospitals`,
        method: "GET",
      });
      console.log(data,"Recent Hospitals")
      setRecentHospitals(data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      fetchPatientDetails();
      // Uncomment the following if you want to fetch hospitals as well:
      fetchRecentHospitals();
    }
  }, [isAuthenticated, user?._id]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <UserDashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {patient?.full_name || "User"}
          </h1>
          <p className="text-muted-foreground">
            {"Here's an overview of your healthcare journey and recommendations."}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Visits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {appointments.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      appointments.filter(
                        (a) => new Date(a.appointmentDate) > new Date()
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Next 30 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recently Viewed Hospitals</CardTitle>
                <CardDescription>
                  {"Hospitals you've recently viewed."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentHospitals.map((hospital) => (
                    <HospitalCard key={hospital._id} hospital={hospital} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Get AI-Powered Hospital Recommendations</CardTitle>
                <CardDescription>
                  {"Describe your medical needs and we'll find the best hospitals for you."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Recommendations</CardTitle>
                <CardDescription>
                  Based on your medical history and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((hospital) => (
                    <HospitalCard key={hospital._id} hospital={hospital} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-4 border rounded-md mb-2"
                    >
                      <p className="font-medium">
                        Dr. {appointment.doctor.full_name} ({appointment.doctor.specialty})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date:{" "}
                        {new Date(appointment.appointmentDate).toLocaleString().split(",")[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hospital: {appointment.hospital.name} -{" "}
                        {appointment.hospital.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Time Slot: {appointment.timeSlot.day_of_week},{" "}
                        {appointment.timeSlot.start_time} - {appointment.timeSlot.end_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {appointment.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No appointments found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserDashboardLayout>
  );
}
