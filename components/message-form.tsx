"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Loader2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface MessageFormProps {
  patients: Patient[];
}

export function MessageForm({ patients }: MessageFormProps) {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !message.trim()) {
      toast({
        title: "Error",
        description: "Please select a patient and enter a message",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to WhatsApp API
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully via WhatsApp",
      });
      setMessage('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patient">Select Patient</Label>
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger id="patient">
            <SelectValue placeholder="Select a patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending message...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send WhatsApp Message
          </>
        )}
      </Button>
    </form>
  );
}