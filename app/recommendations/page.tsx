"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HospitalCard } from "@/components/hospital-card";
import { MainLayout } from "@/components/layouts/main-layout";
import { mockHospitals } from "@/lib/mock-data";
import { Brain, Loader2 } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { fetchData } from "@/lib/fetchData";

export default function RecommendationsPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiResponse, setAiResponse] = useState("");

  const getRecommendations = async () => {
    try {
      const data = await fetchData({
        url: "/hospital/get-recommendation",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
        }),
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setAiResponse("");
    setRecommendations([]);
    const data = await getRecommendations();
    console.log(data);
    const { response, hospitals } = data;
    setAiResponse(response);
    setRecommendations(hospitals);
    setIsLoading(false);
  };
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI-Powered Hospital Recommendations
            </h1>
            <p className="text-muted-foreground">
              Describe your medical needs and our AI will recommend the best
              hospitals for you.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What are you looking for?</CardTitle>
              <CardDescription>
                Describe your medical condition, the type of treatment you need,
                your location, or any other preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Example: I need a hospital for knee surgery in New York with experienced orthopedic surgeons."
                  className="min-h-[120px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding recommendations...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {aiResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{aiResponse}</p>
              </CardContent>
            </Card>
          )}

          {recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommended Hospitals</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((hospital) => (
                  <HospitalCard key={hospital._id} hospital={hospital} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
