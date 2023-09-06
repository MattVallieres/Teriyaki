"use client"
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context/authContext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const { setCurrentUser, setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
    // Holds the user's entered username
    const [username, setUsername] = useState('');
    // Holds the user's entered password
    const [password, setPassword] = useState('');
    // Controls password visibility
    const [showPassword, setShowPassword] = useState(false);


    // Define state variable for error messages
    const [error, setError] = useState(''); // Holds and displays error messages

    // Add a useEffect to redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated]);
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
        // Toggle the showPassword state between true and false
        setShowPassword(!showPassword);
    };

    // Handle form submission when the user clicks the "Login" button
    const handleFormSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                router.push('/');
            } else {
                setIsAuthenticated(false);
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setIsAuthenticated(false); // Set isAuthenticated to false on error
            // You can also set an error message in your state if needed
        }
    };


    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Image
                src="/demon-slayer.jpg"
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
            />
            <div className="min-h-screen flex justify-center items-center relative">
                <div className="bg-[#202124] px-10 py-8 rounded relative z-10">
                    <h1 className="text-2xl font-bold mb-8">Login To Teriyaki</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full p-2 border-b-2 border-[#797e87] bg-[#202124]"
                                placeholder="Enter username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
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
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <span
                                    className="absolute right-3 top-2 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-700 font-bold py-2 px-4 rounded"
                        >
                            Login
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                    <p className="text-[#797e87] mt-4">
                        Don't have an account? <Link href="/signup" className="text-orange-500">Sign up here!</Link>
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
            </div>
        </div>
    );
}
