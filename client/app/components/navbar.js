"use client"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { GiChicken } from "react-icons/gi";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from '../context/authContext';

export const Navbar = () => {
    const [nav, setNav] = useState(false);
    const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false); // Close the dropdown after signing out
    };

    return (
        <nav className="bg-[#202124]">
            <div className="flex mx-auto justify-between h-[3.75rem] ">
                <div className="flex">
                    <div onClick={handleNav} className="flex items-center justify-center p-4 text-neutral-300 hover:bg-neutral-900 hover:text-slate-50 duration-200 md:hidden">
                        <AiOutlineMenu className="text-xl" />
                    </div>
                    <Link href="/" className="flex items-center justify-center uppercase text-orange-400 font-bold text-xl md:text-2xl p-4">Teriyaki<GiChicken className='ml-2 flex' /></Link>
                </div>
                <div className="flex font-bold uppercase text-sm">
                    <Link href="/search" className="flex items-center px-4 justify-center text-lg text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200"><BiSearchAlt /></Link>
                    <div className="hidden md:flex">
                        <Link href="/recommendation" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Recommendation</Link>
                        <Link href="/popular" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Popular</Link>
                    </div>
                    <div className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200 cursor-pointer" onClick={toggleDropdown}>
                        {isAuthenticated ? (
                            <div className="relative group">
                                <p className='flex items-center'>{currentUser.name}</p>
                                {showDropdown && (
                                    <div className="absolute top-full right-0 mt-6 w-28 bg-[#202124] rounded">
                                        <ul className="py-2">
                                            <li><Link href="/profile" className="flex items-center px-4 py-2 hover:bg-[#161616] cursor-pointer">
                                                Profile
                                            </Link></li>
                                            <li className="px-4 py-2 hover:bg-[#161616] cursor-pointer" onClick={handleLogout}>
                                                Sign Out
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center justify-center text-neutral-300 hover:bg-neutral-900 hover:text-slate-50 duration-200">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {nav && <div className="bg-black/20 fixed w-full h-screen z-10 top-0 right-0"></div>}
            <div
                className={
                    nav
                        ? 'fixed top-0 left-0 w-[250px] h-screen bg-neutral-900 z-10 duration-300'
                        : 'fixed top-0 right-[-100%] w-[250px] h-screen z-10 duration-300'
                }
            >
                <div className="items-center flex p-4">
                    <h1 onClick={handleNav} className="text-[#d4d4d4] text-2xl absolute mt-8 cursor-pointer"><AiOutlineClose /></h1>
                </div>
                <ul className="pt-10 flex flex-col p-4 text-md uppercase font-bold">
                    <li className="flex text-xs text-[#818283]">BROWSE</li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/" onClick={handleNav}>Home</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/recommendation" onClick={handleNav}>Recommendation</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/popular" onClick={handleNav}>Popular</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/search" onClick={handleNav} className="flex items-center justify-center text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Search</Link></li>
                    <li className="flex text-xs text-[#818283] mt-4">ACCOUNT</li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/login" onClick={handleNav}>Login</Link></li>
                </ul>
            </div>
        </nav>
    );
};
