import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Confirmation() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for 2 seconds (you can replace this with actual loading logic)
        const timer = setTimeout(() => {
            setIsLoading(false);

            // Redirect to the homepage after account creation is confirmed
            router.push('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow">
                {isLoading ? (
                    <p>Creating your account...</p>
                ) : (
                    <>
                        <p>Account created successfully!</p>
                        <p>Redirecting you to the homepage.</p>
                        <p>Make sure to log in with your credentials!</p>
                    </>
                )}
            </div>
        </div>
    );
}