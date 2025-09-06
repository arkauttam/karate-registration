import { Award, BarChart3, Users, Medal, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useEffect, useState } from "react";

export const FloatingNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Award },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/belts", label: "Belts", icon: Medal },
    { path: "/students", label: "Students", icon: Users },
  ];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-7xl `}>
      <div className={`transition-all duration-300 flex items-center justify-between bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 sm:px-6 py-3 shadow-lg ${isScrolled ? 'py-3 bg-background/95' : 'py-4 sm:py-4 bg-background/80'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Link
            to="/login"
            className="px-3 lg:px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 lg:px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="transition-all duration-300 absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-2xl p-4 shadow-lg flex flex-col gap-2 md:hidden animate-in slide-in-from-top">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Auth Buttons */}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 text-center"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};
