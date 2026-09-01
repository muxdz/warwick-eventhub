"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar(){
    const{user,loading,logout}=useAuth();
    const pathname=usePathname();
    const[open,setOpen]=useState(false);
    const linkClass=(
        href:string
    )=>`rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8550da] ${pathname===href||(href!=="/"&&pathname.startsWith(href))?"bg-[#eee5fc] text-[#44188c]":"text-slate-700 hover:bg-[#faf8ff] hover:text-[#7442c6]"}`;
    return (
        <nav className="sticky top-0 z-50 border-b border-[#e7e1ef] bg-white/95 backdrop-blur" aria-label="Main navigation">
            <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-[#44188c] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8550da]" onClick={()=>setOpen(false)}>
                <span className="grid size-9 place-items-center rounded-xl bg-[#8550da] text-lg text-white" aria-hidden="true">W</span>
                <span className="text-lg">EventHub</span>
                </Link>
                
                <button type="button" className="btn btn-secondary min-h-10 px-3 md:hidden" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="primary-menu">
                    <span className="sr-only">Toggle navigation</span>
                    <span aria-hidden="true" className="text-lg">{open?"×":"☰"}</span>
                    </button>
                        <div id="primary-menu" className={`${open?"flex":"hidden"} w-full flex-col gap-1 border-t border-[#e7e1ef] py-4 md:flex md:w-auto md:flex-row md:items-center md:border-0 md:py-0`}>
                            <Link href="/events" className={linkClass("/events")} onClick={()=>setOpen(false)}>Events</Link>
                            <Link href="/societies" className={linkClass("/societies")} onClick={()=>setOpen(false)}>Societies</Link>
                            {!loading&&user?<>
                                <Link href="/profile/bookmarks" className={linkClass("/profile/bookmarks")} onClick={()=>setOpen(false)}>Bookmarks</Link>
                                <Link href="/profile" className={linkClass("/profile")} onClick={()=>setOpen(false)}>Profile</Link>
                                <button type="button" onClick={()=>{setOpen(false);logout();}} className="btn btn-secondary mt-2 md:mt-0 md:ml-2">Logout</button>
                                </>:!loading?<>
                                
                                <Link href="/login" className={linkClass("/login")} onClick={()=>setOpen(false)}>Login</Link>
                                <Link href="/register" className="btn btn-primary mt-2 md:mt-0 md:ml-2" onClick={()=>setOpen(false)}>Register</Link>
                            </>:null}
                        </div>
            </div>
        </nav>
    );
}
