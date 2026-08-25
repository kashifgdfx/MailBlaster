"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  LayoutDashboard,
  Send,
  Users,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  User,
  LogOut,
  ChevronUp,
} from "lucide-react";

import LogoutModal from "@/components/common/LogoutModal";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Send,
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [companyName, setCompanyName] =
    useState("EmailBlaster");

  const [logo, setLogo] = useState("");

  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.companyName) {
          setCompanyName(data.companyName);
        }

        if (data?.logo) {
          setLogo(data.logo);
        }
      })
      .catch(() => {});

    const storedUser =
      localStorage.getItem(
        "emailblaster_user"
      );

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "emailblaster_user"
    );

    router.push("/login");
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">

        {/* Logo Section */}
        <div className="flex items-center h-16 px-6 font-bold text-lg text-white tracking-wide gap-3 border-b border-slate-800">
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">
              E B
            </div>
          )}

          <span className="truncate">
            {companyName}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Account Section */}
        <div
          ref={menuRef}
          className="p-4 border-t border-slate-800 relative"
        >
          <button
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {user?.email || ""}
              </p>
            </div>

            <ChevronUp
              className={`w-4 h-4 transition-transform ${
                showMenu
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {showMenu && (
            <div className="absolute bottom-20 left-4 right-4 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

              <div className="p-4 border-b border-slate-700">
                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {user?.email}
                </p>
              </div>

              <Link
                href="/settings"
                onClick={() =>
                  setShowMenu(false)
                }
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition"
              >
                <User className="w-4 h-4" />
                Account
              </Link>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-slate-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() =>
          setShowLogoutModal(false)
        }
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </>
  );
}