"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HospitalCard } from "@/components/hospital-card";
import { mockHospitals } from "@/lib/mock-data";
import { Brain, Loader2 } from "lucide-react";
import { fetchData } from "@/lib/fetchData";

export function RecommendationForm() {
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
    const { response, hospitals } = await getRecommendations();
    setAiResponse(response);
    setRecommendations(hospitals);
    setIsLoading(false);
  };
  return (
    <div className="space-y-6">
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

      {aiResponse && (
        <div className="bg-muted p-4 rounded-md">
          <div className="flex items-center mb-2">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">AI Analysis</h3>
          </div>
          <p className="text-sm">{aiResponse}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Recommended Hospitals</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
