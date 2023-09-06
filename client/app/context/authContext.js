"use client"
import React, { createContext, useState } from 'react';

// Create a new context instance
export const AuthContext = createContext(null);

// Create a provider component that wraps its children with the UserContext
export const AuthContextProvider = ({ children }) => {

    //state for user logged in
    const [currentUser, setCurrentUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserRating, setCurrentUserRating] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); 

    const logout = async () => {
        try {
            // Perform any necessary logout actions on the server (e.g., clearing session)
            // You can also clear client-side authentication state here
            setIsAuthenticated(false);
            setCurrentUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        // Provide the currentUser, setCurrentUser, authenticated, and setAuthenticated values to the context
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated, logout, currentUserRating, setCurrentUserRating, isBookmarked, setIsBookmarked }}>
            {children}
        </AuthContext.Provider>
    );
};