"use client"
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function Profile() {
  const { isAuthenticated, currentUser } = useContext(AuthContext);

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page
    // or show a message indicating they need to log in.
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Username: {currentUser.name}</p>
      <p>Email: {currentUser.email}</p>
      {/* Add more user-specific information here */}
    </div>
  );
};