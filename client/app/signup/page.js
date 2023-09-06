"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

export default function Signup() {
    const router = useRouter(); // Initialize the router to enable page navigation

    // Define and initialize state variables for username, password, and showPassword
    const [username, setUsername] = useState(''); // Holds the user's entered username
    const [password, setPassword] = useState(''); // Holds the user's entered password
    const [showPassword, setShowPassword] = useState(false); // Controls password visibility

    // Define state variable for error messages
    const [error, setError] = useState(''); // Holds and displays error messages

    // Handle changes in the username input field
    const handleUsernameChange = (e) => {
        setUsername(e.target.value); // Update the username state with the user's input
    };

    // Handle changes in the password input field
    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Update the password state with the user's input
    };

    // Toggle the visibility of the password text
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle the showPassword state between true and false
    };

    // Handle form submission when the user clicks the "Sign Up" button
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page reload)

        try {
            // Send a POST request to the server to create a new user account
            const response = await fetch('http://localhost:8000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the request content type to JSON
                },
                body: JSON.stringify({
                    username, // Include the entered username in the request body
                    password, // Include the entered password in the request body
                }),
            });

            // Check the server's response status code
            if (response.status === 201) {
                // If the response status is 201 (Created), redirect the user to the home page
                router.push('/');
                return;
            }

            // If the response status is 400 (Bad Request), parse and display the error message from the server
            if (response.status === 400) {
                const data = await response.json(); // Parse the response body as JSON
                setError(data.error); // Set the error state with the error message from the server
            } else {
                // If the response status is not 201 or 400, display a generic error message
                setError('Signup failed. Please try again.');
            }
        } catch (error) {
            // Handle any unexpected errors that may occur during the fetch operation
            console.error('Error:', error); // Log the error to the console
            setError('An error occurred. Please try again.'); // Set a generic error message in the error state
        }
    };


    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Image
                src="/one-piece.jpg"
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
            />
            <div className="min-h-screen flex justify-center items-center relative">
                <div className="bg-[#202124] px-10 py-8 rounded relative z-10">
                    <h1 className="text-2xl font-bold mb-8">Create Teriyaki Account</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full p-2 border-b-2 border-[#797e87] bg-[#202124]"
                                placeholder="Create username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <p className="text-sm mt-2 text-[#797e87]">Username must contain 3 characters</p>
                            <p className="text-sm text-[#797e87]">Can't contain special characters</p>
                            <p className="text-sm text-[#797e87]">Can't exceed 20 characters</p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-lg">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full p-2 border-b-2 border-[#797e87] bg-[#202124]"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <span
                                    className="absolute right-3 top-2 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <p className="text-sm py-2 text-[#797e87]">Use at least 8 characters</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-blue-600 text-white bold py-2 px-4 rounded"
                        >
                            Sign Up
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                    <p className="text-[#797e87] mt-4">
                        Already have an account? <Link href="/login" className="text-orange-500">Log in here!</Link>
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
            </div>
        </div>
    );
}
