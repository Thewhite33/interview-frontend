'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function SelectSlotPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  interface SubmitResponse {
    message?: string;
  }

  useEffect(() => {
    // Get query params from window.location.search
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    setEmail(emailParam);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !selectedDate || !selectedTime) {
      toast.error('Please select a date and time.');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);
    combinedDate.setSeconds(0);

    const now = new Date();
    if (combinedDate < now) {
      toast.error('Cannot select past date/time.');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'PP'); // eg: Jul 17, 2025
      const formattedTime = format(combinedDate, 'p'); // eg: 8:00 PM

      const res = await fetch('https://interview-backend-9qx6.onrender.com/custom-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date: formattedDate, slot: formattedTime }),
      });

      const data: SubmitResponse = await res.json();
      if (res.ok) {
        toast.success('Your preferred time slot has been saved!');
        setSelectedDate(undefined);
        setSelectedTime('');
      } else {
        toast.error(`${data.message || 'Error occurred'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to the server.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-xl text-center">
      <h1 className="text-2xl font-semibold mb-6">Pick Your Preferred Interview Time</h1>

      {email ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedDate ? format(selectedDate, 'PP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) // disables dates before today
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </form>
      ) : (
        <p className="text-red-500">Email not found in the URL. Please use the valid email link.</p>
      )}
    </div>
  );
}
