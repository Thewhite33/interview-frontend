//@ts-nocheck
'use client';
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import { toast } from 'sonner';
import InterviewsPage from '@/components/InterviewPage';
import { auth } from '../../firebase';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function ScheduleInterviewDialog() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    slots: [{ start: '', end: '' }],
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.slots];
    updatedSlots[index][field] = value;
    setFormData(prev => ({
      ...prev,
      slots: updatedSlots
    }));
  };

  const addSlot = () => {
    setFormData(prev => ({
      ...prev,
      slots: [...prev.slots, { start: '', end: '' }]
    }));
  };

  const removeSlot = (index) => {
    const updatedSlots = [...formData.slots];
    updatedSlots.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      slots: updatedSlots
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedSlots = formData.slots.map(slot => {
        const formatTime = (timeStr) => {
          const [hourStr, minute] = timeStr.split(':');
          let hour = parseInt(hourStr);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 || 12;
          return `${hour}:${minute} ${ampm}`;
        };
        const startFormatted = formatTime(slot.start);
        const endFormatted = formatTime(slot.end);
        return `${startFormatted} - ${endFormatted}`;
      });

      const formattedDate = format(formData.date, 'yyyy-MM-dd');

      const res = await axios.post('http://localhost:3000/send-email', {
        candidateName: formData.name,
        candidateEmail: formData.email,
        slots: formattedSlots,
        date: formattedDate,
      });

      if (res.status === 200) {
        toast.success("Email sent successfully");
        setFormData({ name: '', email: '', slots: [{ start: '', end: '' }], date: new Date() });
      }
    } catch (error) {
      console.error(error);
      toast.error("Email not sent");
    }
    setLoading(false);
  };

  const [user, authloading] = useAuthState(auth);

  if (authloading) return <div className='flex justify-center items-center min-h-screen'><Loader2 className='size-8 animate-spin' /></div>;
  if (!user) {
    return redirect("/auth-page");
  }


  return (
    <div>
      <div className='flex justify-between items-center mx-10 mt-8'>
        <p className='font-semibold text-xl'>Interview Scheduler</p>
        <div className='flex justify-between items-center gap-x-3'>
          <p className='text-sm'>Hello, {user.email}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Schedule Interview</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                  <DialogDescription>
                    Enter candidate name, email, date and your preferred time slots to send email.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-5">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Candidate Name</Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-3">
                    <Label>Interview Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {formData.date ? format(formData.date, 'PP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) // disables dates before today
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-3">
                    <Label>Interview Slots</Label>
                    {formData.slots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleSlotChange(index, 'start', e.target.value)}
                          required
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleSlotChange(index, 'end', e.target.value)}
                          required
                        />
                        {formData.slots.length > 1 && (
                          <Button type="button" variant="destructive" onClick={() => removeSlot(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button type="button" variant="secondary" onClick={addSlot}>
                      + Add Slot
                    </Button>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <InterviewsPage />
    </div>
  );
}