'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface Interview {
    status: string;
    date?: string;
    slot?: string;
}

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState<Record<string, Interview>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await fetch('http://localhost:3000/all-interviews');
                const data = await res.json();
                setInterviews(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchInterviews();
    }, []);

    const acceptedSlots = Object.entries(interviews).filter(([_, interview]) => interview.status === 'Accepted');
    const customSlots = Object.entries(interviews).filter(([_, interview]) => interview.status === 'Custom Slot Selected');

    const downloadExcel = () => {
        const formattedData = Object.entries(interviews).map(([email, interview]) => ({
            Email: email,
            Date: interview.date || '',
            Slot: interview.slot || interviews.customSlot || '',
            Status: interview.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Interviews');

        XLSX.writeFile(workbook, 'interviews.xlsx');
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <div className='flex justify-between mb-5'>
                <h1 className="text-xl font-semibold mb-6 text-center">All Interview Slots</h1>
                <Button onClick={downloadExcel}>Download Excel</Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
                </div>
            ) : (
                <Tabs defaultValue="accepted" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="accepted">Accepted Slots</TabsTrigger>
                        <TabsTrigger value="custom">Custom Slots</TabsTrigger>
                    </TabsList>

                    <TabsContent value="accepted">
                        {acceptedSlots.length > 0 ? (
                            acceptedSlots.map(([email, interview]) => (
                                <Card key={email} className="mt-4">
                                    <CardContent className="p-4">
                                        <p><strong>Email:</strong> {email}</p>
                                        <p><strong>Date:</strong> {interview.date || 'N/A'}</p>
                                        <p><strong>Slot:</strong> {interview.slot || 'N/A'}</p>
                                        <p><strong>Status:</strong> {interview.status}</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center mt-4">No accepted slots found.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="custom">
                        {customSlots.length > 0 ? (
                            customSlots.map(([email, interview]) => (
                                <Card key={email} className="mt-4">
                                    <CardContent className="p-4">
                                        <p><strong>Email:</strong> {email}</p>
                                        <p><strong>Date:</strong> {interview.date || 'N/A'}</p>
                                        <p><strong>Slot:</strong> {interview.slot || 'N/A'}</p>
                                        <p><strong>Status:</strong> {interview.status}</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center mt-4">No custom slots found.</p>
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
