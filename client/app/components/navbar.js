"use client"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { GiChicken } from "react-icons/gi";
import React, { useState } from "react";
import Link from "next/link";

export const Navbar = () => {
    // We keep track wether the sidebar is open or not
    const [nav, setNav] = useState(false);
    // When the button is clicked open the side bar
    const handleNav = () => {
        setNav(!nav)
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
                        <Link href="/trending" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Trending</Link>
                        <Link href="/popular" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Popular</Link>
                        <Link href="/genres" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Genres</Link>
                    </div>
                    <div className="flex uppercase font-bold">
                        <Link href="/login" className="flex items-center px-4 text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Login</Link>
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
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/trending" onClick={handleNav}>Trending</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/popular">Popular</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/genres">Genres</Link></li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/search" className="flex items-center justify-center text-neutral-300 hover:bg-[#161616] hover:text-slate-50 duration-200">Search</Link></li>
                    <li className="flex text-xs text-[#818283] mt-4">ACCOUNT</li>
                    <li className="py-2 flex text-[#d4d4d4]"><Link href="/login">Login</Link></li>
                </ul>
            </div>
        </nav>
    );
};
