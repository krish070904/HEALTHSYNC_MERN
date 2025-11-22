import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [profileImage, setProfileImage] = useState(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCq7A7u_bex9FXa_-2s4tWovTclbrwcYKJsTUI4Y5fxd-hLOcXD8fhMAU6QyCv5QYR9FxMaLmO3tIyGouDjwIfr_a8GV-kWzCQWTjH7frTqPGRMa4rsidUWZfGl-I89qb57vrvbpisv9GY3xxt4oJE-bvhrmWP0dxCiaD-LdFB1yi1iRb_ToRi6SXEQSMt7SomcbxxfMt2WMo0mbMadtn56z1HhlATgYSoHXUXoq7iib3ubN4AE77nj8uuGW7blxohvOh9FvFdjI-rB"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path
      ? "border-primary text-gray-900 dark:text-white"
      : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              <span className="text-2xl">🏥</span>
              <span className="font-display">Healthsync</span>
            </Link>

            {/* Primary Navigation (Desktop) */}
            <div className="hidden items-center space-x-6 md:flex">
              <Link
                to="/dashboard"
                className={`border-b-2 pb-1 text-sm font-medium ${isActive(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>
              <Link
                to="/symptom-entry"
                className={`border-b-2 pb-1 text-sm font-medium ${isActive(
                  "/symptom-entry"
                )}`}
              >
                Symptom Tracker
              </Link>
              <Link
                to="/daily-monitoring"
                className={`border-b-2 pb-1 text-sm font-medium ${isActive(
                  "/daily-monitoring"
                )}`}
              >
                Daily Monitoring
              </Link>
              <Link
                to="/chat"
                className={`border-b-2 pb-1 text-sm font-medium ${isActive(
                  "/chat"
                )}`}
              >
                Chatbot
              </Link>
            </div>
          </div>

          {/* Middle Section (Desktop) */}
          <div className="hidden items-center space-x-6 lg:flex">
            <Link
              to="/diet-recipes"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Diet Plan
            </Link>
           
           
            <Link
              to="/scheduler"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Medication Schedule
            </Link>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link
              to="/notifications"
              className="relative rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                3
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div
                  className="size-9 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${profileImage}')`,
                  }}
                ></div>
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                  isDropdownOpen
                    ? "opacity-100 visible transform scale-100"
                    : "opacity-0 invisible transform scale-95"
                }`}
              >
                <button
                  onClick={triggerFileInput}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Change Profile Pic
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Icons + Menu Button */}
          <div className="flex items-center md:hidden">
            <Link
              to="/notifications"
              className="relative mr-2 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                3
              </span>
            </Link>

            <div
              className="size-9 rounded-full bg-cover bg-center mr-2"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDH2L7uHY8gsZXWV6Zpg4MaI55VYt5ODWJp0LdLvBsD7XoNKVdiPsXxvX_TBsY4JLAmz5fdfV14zbQ1MnwOafyNAdnJNBoQz2xS3uXht3iXU5FjnefXU-fepcmdvWQd0PVyn7f3G5UU7ZxHKsi0g9temflpTvYeXgPwv7vLEt7xvbMbVvFFZUT7ZXlpIiV0qOpwtC22Y1WUvfsWgLHo5OQ5wMlrHqFnv_TFOwylOz2VvgurdhyVEADk7fXezQ2-SYgmeWVU8KcWt1l2')",
              }}
            ></div>

            <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
