import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { Button } from "./UI";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-surface-200 shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/hireflow-logo-icon.svg"
            alt="HireFlow"
            className="w-8 h-8"
          />
          <span className="font-bold text-lg text-brand-600 hidden md:inline">
            HireFlow
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-surface-600 hover:text-surface-900 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-surface-700 hover:text-brand-600 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/resume"
            className="text-surface-700 hover:text-brand-600 font-medium transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/jobs"
            className="text-surface-700 hover:text-brand-600 font-medium transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/interviews"
            className="text-surface-700 hover:text-brand-600 font-medium transition-colors"
          >
            Interview Prep
          </Link>
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {userName ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="font-semibold text-brand-700 text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-surface-700">
                {userName}
              </span>
              <button
                onClick={onLogout}
                className="text-surface-600 hover:text-surface-900 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 p-4 space-y-3">
          <Link
            href="/dashboard"
            className="block text-surface-700 hover:text-brand-600 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/resume"
            className="block text-surface-700 hover:text-brand-600 font-medium"
          >
            Resume
          </Link>
          <Link
            href="/jobs"
            className="block text-surface-700 hover:text-brand-600 font-medium"
          >
            Jobs
          </Link>
          <Link
            href="/interviews"
            className="block text-surface-700 hover:text-brand-600 font-medium"
          >
            Interview Prep
          </Link>
          {!userName && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
