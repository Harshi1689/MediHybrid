import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  LayoutDashboard,
  History,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/diabetes', label: 'Diabetes', icon: Activity },
    { to: '/heart', label: 'Heart Disease', icon: Heart },
    { to: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                Medi<span className="text-teal-600">Hybrid</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wider uppercase">
                Intelligent Disease Diagnosis System
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fade-in">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
