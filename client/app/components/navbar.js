"use client"
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import { BiUser, BiLogOut } from 'react-icons/bi';
import { GiChicken } from 'react-icons/gi'
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';
import { FiBookmark, FiUser } from "react-icons/fi"


import { AuthContext } from '../context/authContext';

export const Navbar = () => {
    // Keep track wether the user is signed in, authenticated and handle log out session
    const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
    // Keep track wether the dropdown is open or not
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Keep track wether the hamburger is open or not
    const [nav, setNav] = useState(false);

    // Function to show dropwdown or not
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Function to show nav or not
    const handleNav = () => {
        setNav(!nav);
    };

    // Function to lout out the user
    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-neutral-800 z-20 sticky top-0">
            <div className="flex justify-between">
                <div className="h-[3.75rem] flex">
                    {/* Hamburger */}
                    <div onClick={handleNav} className="flex items-center text-lg px-4 hover:bg-neutral-900 duration-200 cursor-pointer md:hidden">
                        <AiOutlineMenu />
                    </div>
                    {/* Title */}
                    <Link href="/" className="flex items-center uppercase text-orange-500 font-semibold text-base md:text-xl px-4 hover:text-slate-50 duration-200">Teriyaki Anime<GiChicken className='ml-2 flex hidden md:flex' /></Link>
                </div>
                {/* Navigation and Search */}
                <div className="flex">
                    {/* Search */}
                    <Link href="/search" className="flex items-center px-4 justify-center text-lg md:text-xl hover:bg-neutral-900 duration-200"><AiOutlineSearch /></Link>
                    <div className="hidden md:flex text-base">
                        {/* Navigation */}
                        <Link href="/popular" className="flex px-4 items-center hover:bg-neutral-900 duration-200">Popular</Link>
                        <Link href="/recommendation" className="flex px-4 items-center hover:bg-neutral-900 duration-200">Recommendation</Link>
                    </div>

                    {/* Dropdown and User Navigation */}
                    <div className="flex">
                        {isAuthenticated && currentUser ? (
                            <button onClick={toggleDropdown} className="px-4 relative hover:bg-neutral-900">
                                {/* User Profile */}
                                <BiUser className="text-lg md:text-2xl flex items-center justify-center text-gray-200" />
                            </button>
                        ) : (
                            <Link href="/login" className="flex text-base px-4 items-center">
                                Login
                            </Link>
                        )}

                        {isDropdownOpen && (
                            <div className="absolute top-16 w-72 right-2 bg-neutral-900 rounded md:w-72 flex flex-col">
                                <div className="flex items-center ">
                                    <BiUser className="ml-4 text-xl md:text-2xl flex items-center justify-center text-gray-200" />
                                    <h1 className="pl-2 py-6 block text-lg">{currentUser.name}</h1>
                                </div>
                                {/* User Navigation */}
                                <Link href="/bookmarks" className="flex p-2 items-center hover:bg-neutral-800 duration-200"><FiBookmark className="mr-2" />Bookmarks</Link>
                                <Link href="/profile" className="flex p-2 items-center hover:bg-neutral-800 duration-200"><FiUser className="mr-2" />My Account</Link>
                                <span onClick={handleLogout} className="flex p-2 items-center hover:bg-neutral-800 cursor-pointer duration-200"><BiLogOut className="mr-2" />Logout</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {nav && <div className="bg-black/20 fixed w-full h-screen z-10 right-0"></div>}

            {/* Side Drawer */}
            <div
                className={
                    nav
                        ? 'fixed top-[3.75rem] left-0 w-[250px] h-screen bg-neutral-900 z-10 duration-300'
                        : 'fixed top-0 right-[-100%] w-[250px] h-screen z-10 duration-300'
                }
            >
                {/* Navigation */}
                <ul className="pt-4 p-4">
                    <li className="text-xs uppercase text-zinc-400 font-bold">BROWSE</li>
                    <li className="py-2 flex">
                        <Link href="/recommendation" onClick={handleNav}>
                            Recommendation
                        </Link>
                    </li>
                    <li className="py-2 flex">
                        <Link href="/popular" onClick={handleNav}>
                            Popular
                        </Link>
                    </li>
                </ul>
            </div>
        </nav >
    );
};