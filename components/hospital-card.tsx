"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone, Calendar } from "lucide-react";

type Hospital = {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  specialty: string;
  bed_total: number;
  bed_available: number;
  is_icu_available: boolean;
  icu_total: number;
  icu_available: number;
  phone: string;
  email: string;
  image?: string;
  rating?: number;
  established?: string;
};

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg truncate">{hospital.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{hospital.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">
              {hospital.address}, {hospital.city}, {hospital.state}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-1" />
            <span>{hospital.phone}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              +{hospital.specialty.length - 3} more
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/hospitals/${hospital._id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/booking/${hospital._id}`}>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
