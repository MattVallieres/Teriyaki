"use client"
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import { BiSearchAlt, BiLogOut } from 'react-icons/bi';
import { GiChicken } from 'react-icons/gi'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
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
        <nav className="bg-[#202124] relative font-light z-20 text-neutral-300">
            <div className="flex mx-auto justify-between">
                <div className="h-[3.75rem] flex">
                    {/* Hamburger */}
                    <div onClick={handleNav} className="flex items-center justify-center p-4 text-neutral-300 hover:text-slate-50 duration-200 cursor-pointer md:hidden">
                        <AiOutlineMenu className="text-xl" />
                    </div>
                    {/* Title */}
                    <Link href="/" className="flex items-center justify-center uppercase text-orange-400 font-bold text-xl md:text-2xl p-4">Teriyaki<GiChicken className='ml-2 flex hidden md:flex' /></Link>
                </div>
                {/* Navigation and Search */}
                <div className="flex font-medium">
                    {/* Search */}
                    <Link href="/search" className="flex items-center px-4 justify-center text-lg hover:text-slate-50 duration-200"><BiSearchAlt /></Link>
                    <div className="hidden md:flex h-[3.75rem]">
                        {/* Navigation */}
                        <Link href="/popular" className="flex px-4 items-center hover:text-slate-50 duration-200">Popular</Link>
                        <Link href="/recommendation" className="flex px-4 items-center hover:text-slate-50 duration-200">Recommendation</Link>
                    </div>

                    {/* Dropdown and User Navigation */}
                    <div className="flex">
                        {isAuthenticated && currentUser ? (
                            <button onClick={toggleDropdown} className="px-4 relative">
                                {/* User Profile Picture */}
                                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                    {currentUser.name}
                                </div>
                            </button>
                        ) : (
                            <Link href="/login" className="flex px-4 items-center font-medium text-neutral-300 hover:text-slate-50 duration-200">
                                Login
                            </Link>
                        )}

                        {isDropdownOpen && (
                            <div className="absolute top-[3.75rem] w-60 right-0 bg-[#161616] md:w-72">
                                <div className="flex p-2 items-center my-2">
                                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm mr-2">
                                        {currentUser.name}
                                    </div>
                                    <h1 className="flex py-2 items-center block hover:bg-neutral-900"> {currentUser.name} </h1>
                                </div>
                                    {/* User Navigation */}
                                    <Link href="/bookmarks" className="flex p-2 items-center hover:bg-neutral-800 hover:text-slate-50 duration-200"><FiBookmark className="mr-2" /> Bookmarks</Link>
                                    <Link href="/profile" className="flex p-2 items-center hover:bg-neutral-800 hover:text-slate-50 duration-200"><FiUser className="mr-2" /> My Account</Link>
                                    <span onClick={handleLogout} className="flex p-2 items-center hover:bg-neutral-600 hover:bg-neutral-800 cursor-pointer hover:text-slate-50 duration-200"><BiLogOut className="mr-2" />Logout</span>
                                </div>
                        )}
                    </div>
                </div>
            </div>


            {nav && <div className="bg-black/20 fixed w-full h-screen z-10 top-0 right-0"></div>}

            {/* Side Drawer */}
            <div
                className={
                    nav
                        ? 'fixed top-0 left-0 w-[250px] h-screen bg-neutral-900 z-10 duration-300'
                        : 'fixed top-0 right-[-100%] w-[250px] h-screen z-10 duration-300'
                }
            >

                {/* Close Side Drawer */}
                <div className="items-center flex p-4">
                    <h1 onClick={handleNav} className="flex items-center text-xl absolute mt-8 text-md cursor-pointer"><AiOutlineClose /></h1>
                </div>

                {/* Navigation */}
                <ul className="pt-10 flex flex-col p-4 text-md ">
                    <li className="flex text-xs uppercase text-[#818283] font-bold">BROWSE</li>
                    <li className="py-2 flex hover:text-slate-50 duration-200">
                        <Link href="/" onClick={handleNav}>
                            Home
                        </Link>
                    </li>
                    <li className="py-2 flex hover:text-slate-50 duration-200">
                        <Link href="/recommendation" onClick={handleNav}>
                            Recommendation
                        </Link>
                    </li>
                    <li className="py-2 flex hover:text-slate-50 duration-200">
                        <Link href="/popular" onClick={handleNav}>
                        Popular
                        </Link>
                    </li>
                </ul>
            </div>
        </nav >
    );
};