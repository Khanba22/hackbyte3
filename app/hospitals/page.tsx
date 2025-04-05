"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { HospitalCard } from "@/components/hospital-card";
import { MainLayout } from "@/components/layouts/main-layout";
import { Search } from 'lucide-react';
import { fetchData } from "@/lib/fetchData";

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bedAvailable, setBedAvailable] = useState([0]);
  const [icuAvailable, setIcuAvailable] = useState([0]);

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

  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetchHospitalList();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, specialty, city, state, bedAvailable, icuAvailable, hospitalList]);

  const fetchHospitalList = async () => {
    const data = await fetchData({ method: "GET", url: "/hospital" });

    // Convert API data to match `Hospital` type
    const hospitals: Hospital[] = data.map((hospital: any) => ({
      _id: hospital._id, // Map `_id` to `id`
      name: hospital.name,
      address: hospital.address || "Not specified",
      city: hospital.city,
      state: hospital.state,
      specialty: hospital.specialty,
      bed_total: hospital.bed_total,
      bed_available: hospital.bed_available,
      is_icu_available: hospital.is_icu_available,
      icu_total: hospital.icu_total,
      icu_available: hospital.icu_available,
      phone: hospital.phone,
      email: hospital.email,
      image: hospital.image || "/default-hospital.jpg",
      rating: hospital.rating || 4.5,
      established: hospital.established || "Unknown",
    }));

    setHospitalList(hospitals);
  };

  const handleFilter = () => {
    let filtered = hospitalList;

    if (searchTerm) {
      filtered = filtered.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialty) {
      filtered = filtered.filter((hospital) => hospital.specialty === specialty);
    }

    if (city) {
      filtered = filtered.filter((hospital) =>
        hospital.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (state) {
      filtered = filtered.filter((hospital) =>
        hospital.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (bedAvailable[0] > 0) {
      filtered = filtered.filter((hospital) => hospital.bed_available >= bedAvailable[0]);
    }

    if (icuAvailable[0] > 0) {
      filtered = filtered.filter((hospital) => hospital.icu_available >= icuAvailable[0]);
    }

    setFilteredHospitals(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSpecialty("");
    setCity("");
    setState("");
    setBedAvailable([0]);
    setIcuAvailable([0]);
    setFilteredHospitals(hospitalList);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8  text-slate-200">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Find Hospitals</h1>
            <p className="text-slate-400">
              Search and filter hospitals based on your preferences.
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-slate-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="search"
                      placeholder="Search hospitals..."
                      className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-slate-300">Specialty</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty" className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectItem value="Multispecialty" className="focus:bg-slate-700 focus:text-slate-100">Multispecialty</SelectItem>
                      <SelectItem value="Cardiology" className="focus:bg-slate-700 focus:text-slate-100">Cardiology</SelectItem>
                      <SelectItem value="General Medicine and Intensive Care" className="focus:bg-slate-700 focus:text-slate-100">
                        General Medicine and Intensive Care
                      </SelectItem>
                      <SelectItem value="Obstetrics and Gynaecology" className="focus:bg-slate-700 focus:text-slate-100">
                        Obstetrics and Gynaecology
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital._id} hospital={hospital} />
              ))
            ) : (
              <p className="text-center text-slate-400">No hospitals found.</p>
            )}
          </div>

          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-slate-600 text-blue-400 hover:bg-slate-700 hover:text-blue-300"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
