'use client';

import { useEffect, useState } from 'react';

export default function Page() {
    const [email, setEmail] = useState<string | null>(null);
    const [slot, setSlot] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [status, setStatus] = useState('Saving your response...');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const slotParam = params.get('slot');
        const dateParam = params.get('date');

        setEmail(emailParam);
        setSlot(slotParam);
        setDate(dateParam);

        if (!emailParam || !slotParam || !dateParam) {
            setStatus('Missing required information.');
            return;
        }

        const saveAcceptedSlot = async () => {
            try {
                const res = await fetch('https://interview-backend-9qx6.onrender.com/accept-slot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailParam, slot: slotParam, date: dateParam }),
                });

                if (res.ok) {
                    setStatus('Thank you! Your interview slot has been confirmed.');
                } else {
                    setStatus('Something went wrong while saving your response.');
                }
            } catch (error) {
                console.error(error);
                setStatus('Failed to connect to the server.');
            }
        };

        saveAcceptedSlot();
    }, []);

    return (
        <div className="max-w-xl mx-auto mt-20 text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Interview Confirmation</h1>
            <p>{status}</p>
        </div>
    );
}
