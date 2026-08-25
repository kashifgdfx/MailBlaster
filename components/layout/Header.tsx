"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";
import LogoutModal from "@/components/common/LogoutModal";

export default function Header() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("EmailBlaster Pro");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data?.companyName) setCompanyName(data.companyName); })
      .catch(() => {});
    // Example: Check if user data exists in localStorage after login
    const storedUser = localStorage.getItem("emailblaster_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Testing ke liye default dummy user set kar sakte hain ya null chhod sakte hain
    //   setUser({ name: "Alex Morgannnn", email: "alex@company.com" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("emailblaster_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      {/* Left side: Page Title or Breadcrumb space */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</span>
        <h2 className="text-sm font-bold text-slate-800">{companyName}</h2>
      </div>

      {/* Right side: Dynamic Auth State (User Profile vs Login/Signup buttons) */}
      <div className="flex items-center gap-4">
        {user ? (
          // Agar User Login hai: Name Initial + Name/Email + Logout Button
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full">
              {/* Name Initial Avatar */}
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <LogoutModal
              isOpen={showLogoutModal}
              onClose={() => setShowLogoutModal(false)}
              onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
            />
          </div>
        ) : (
          // Agar User Logged Out hai: Login aur Signup Buttons
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}