'use client'

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SelectSlotPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [customSlot, setCustomSlot] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    interface SubmitResponse {
        message?: string;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!email || !customSlot) {
            setMessage('❌ Please enter a valid date/time.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/custom-slot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, customSlot }),
            });

            const data: SubmitResponse = await res.json();
            if (res.ok) {
                setMessage('✅ Your preferred time slot has been saved!');
                setCustomSlot('');
            } else {
                setMessage(`❌ ${data.message || 'Error occurred'}`);
            }
        } catch (error) {
            console.error(error);
            setMessage('❌ Failed to connect to the server.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow-xl text-center">
            <h1 className="text-2xl font-semibold mb-4">Pick Your Preferred Interview Time</h1>

            {email ? (
                <>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="datetime-local"
                            value={customSlot}
                            onChange={(e) => setCustomSlot(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Submit'}
                        </button>
                    </form>
                    {message && <p className="mt-4 text-sm">{message}</p>}
                </>
            ) : (
                <p className="text-red-500">Email not found in the URL. Please use the valid email link.</p>
            )}
        </div>
    );
}
