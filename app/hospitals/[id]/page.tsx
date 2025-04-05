"use client";

import { useState, useEffect, Key } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Stethoscope,
  User,
} from "lucide-react";
import Image from "next/image";
import { fetchData } from "@/lib/fetchData";


export default function HospitalDetailsPage() {
  const [hospitalDetails, setHospitalDetails] = useState<any>(null);

  const fetchHospital = async (id: string) => {
    const data = await fetchData({
      method: "GET",
      url: `/hospital/${id}`,
    });
    console.log(JSON.stringify(data));
    setHospitalDetails({
      ...data.hospital,
      staff: data.staff,
    });
  };

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    fetchHospital(id as string);
  }, []);

  if (!hospitalDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Hospital Image & Basic Info */}
        <div className="space-y-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={hospitalDetails.image}
              alt={hospitalDetails.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {hospitalDetails.name}
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  <span>{hospitalDetails.rating}</span>
                </div>
              </CardTitle>
              <CardDescription>{hospitalDetails.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-500" />
                <span>{hospitalDetails.address}, {hospitalDetails.city}, {hospitalDetails.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-green-500" />
                <span>{hospitalDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="text-purple-500" />
                <span>{hospitalDetails.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Hospital Information */}
        <div>
          <Tabs defaultValue="specialties">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="specialties">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Specializations</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {(Array.isArray(hospitalDetails.specialty)
                    ? hospitalDetails.specialty
                    : [hospitalDetails.specialty]
                  ).map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      <Stethoscope className="mr-2 h-4 w-4" /> {spec}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold">Beds</h3>
                      <p>
                        Total: {hospitalDetails.bed_total}, Available: {hospitalDetails.bed_available}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">ICU</h3>
                      <p>
                        Total: {hospitalDetails.icu_total}, Available: {hospitalDetails.icu_available}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  {hospitalDetails.staff && hospitalDetails.staff.length > 0 ? (
                    hospitalDetails.staff.map((staff: IDoctor, index: Key) => (
                      <div
                        key={index}
                        className="border-b py-4 last:border-b-0 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-semibold">{staff.full_name}</h4>
                          <p className="text-sm">{staff.specialty}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <User className="mr-2 h-4 w-4" /> {staff.phone}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p>No staff information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Operating Hours
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hospitalDetails.operatingHours
              ? Object.entries(hospitalDetails.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))
              : <p>No operating hours available.</p>}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
