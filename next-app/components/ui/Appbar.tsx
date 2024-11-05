"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";

export const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 ">
            <Link href="/projects" className="text-2xl font-bold ">
              ConverSales
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              <div className="mr-4">
                <ModeToggle />
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-600 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-2 inline" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
