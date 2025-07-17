'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AcceptSlot() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const slot = searchParams.get('slot');
    const date = searchParams.get('date');

    const [status, setStatus] = useState('Saving your response...');

    useEffect(() => {
        if (!email || !slot || !date) {
            setStatus('Missing required information.');
            return;
        }

        const saveAcceptedSlot = async () => {
            try {
                const res = await fetch('http://localhost:3000/accept-slot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, slot, date }), // ✅ include date in request body
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
    }, [email, slot, date]);

    return (
        <div className="max-w-xl mx-auto mt-20 text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Interview Confirmation</h1>
            <p>{status}</p>
        </div>
    );
}
