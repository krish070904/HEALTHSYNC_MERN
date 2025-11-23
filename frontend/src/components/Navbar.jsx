import React, { useState, useRef, useEffect, useContext } from "react";
import HealthSyncLogo from "../assets/Logo/HealthSyncLogo.png";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { updateProfileImage } from "../services/authService";

const Navbar = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, updateUser } = useContext(AuthContext);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProfileImageUrl = (path) => {
    if (!path) return "https://lh3.googleusercontent.com/aida-public/AB6AXuCq7A7u_bex9FXa_-2s4tWovTclbrwcYKJsTUI4Y5fxd-hLOcXD8fhMAU6QyCv5QYR9FxMaLmO3tIyGouDjwIfr_a8GV-kWzCQWTjH7frTqPGRMa4rsidUWZfGl-I89qb57vrvbpisv9GY3xxt4oJE-bvhrmWP0dxCiaD-LdFB1yi1iRb_ToRi6SXEQSMt7SomcbxxfMt2WMo0mbMadtn56z1HhlATgYSoHXUXoq7iib3ubN4AE77nj8uuGW7blxohvOh9FvFdjI-rB";
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  const [profileImage, setProfileImage] = useState(getProfileImageUrl(user?.profileImage));

  useEffect(() => {
    setProfileImage(getProfileImageUrl(user?.profileImage));
  }, [user?.profileImage]);

  const isActive = (path) => location.pathname === path
    ? "border-primary text-gray-900 dark:text-white"
    : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const objectUrl = URL.createObjectURL(file);
        setProfileImage(objectUrl);

        const formData = new FormData();
        formData.append("image", file);

        const response = await updateProfileImage(formData);
        if (response.user) updateUser(response.user);
      } catch (error) {
        console.error("Failed to upload profile image:", error);
        setProfileImage(getProfileImageUrl(user?.profileImage));
        const errorMessage = error.response?.data?.message || "Failed to update profile picture. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <img src={HealthSyncLogo} alt="Healthsync Logo" className="h-8 w-auto" />
            </Link>

            <div className="hidden items-center space-x-6 md:flex">
              <Link to="/dashboard" className={`border-b-2 pb-1 text-sm font-medium ${isActive("/dashboard")}`}>Dashboard</Link>
              <Link to="/symptom-entry" className={`border-b-2 pb-1 text-sm font-medium ${isActive("/symptom-entry")}`}>Symptom Tracker</Link>
              <Link to="/daily-monitoring" className={`border-b-2 pb-1 text-sm font-medium ${isActive("/daily-monitoring")}`}>Daily Monitoring</Link>
              <Link to="/chat" className={`border-b-2 pb-1 text-sm font-medium ${isActive("/chat")}`}>Chatbot</Link>
            </div>
          </div>

          <div className="hidden items-center space-x-6 lg:flex">
            <Link to="/diet-recipes" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Diet Plan</Link>
            <Link to="/scheduler" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Medication Schedule</Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <Link to="/notifications" className="relative rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button className="flex items-center space-x-2" onClick={toggleDropdown}>
                <div className="size-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${profileImage}')` }}></div>
              </button>

              <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-200 ${dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <button onClick={triggerFileInput} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Change Profile Pic</button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <Link to="/notifications" className="relative mr-2 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</span>
            </Link>

            <div className="size-9 rounded-full bg-cover bg-center mr-2" style={{ backgroundImage: `url('${profileImage}')` }}></div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200">
              <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}>
          <div className="space-y-2 px-2 pt-2 pb-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/dashboard" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">dashboard</span>Dashboard</div>
            </Link>
            <Link to="/symptom-entry" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/symptom-entry" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">clinical_notes</span>Symptom Tracker</div>
            </Link>
            <Link to="/daily-monitoring" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/daily-monitoring" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">ecg_heart</span>Daily Monitoring</div>
            </Link>
            <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/chat" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">smart_toy</span>Chatbot</div>
            </Link>
            <Link to="/diet-recipes" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/diet-recipes" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">restaurant_menu</span>Diet Plan</div>
            </Link>
            <Link to="/scheduler" onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname === "/scheduler" ? "bg-primary/10 text-primary dark:text-primary-light" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">calendar_month</span>Medication Schedule</div>
            </Link>

            <div className="my-2 h-px bg-gray-200 dark:bg-gray-700"></div>

            <button onClick={() => { triggerFileInput(); setMobileMenuOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">account_circle</span>Change Profile Pic</div>
            </button>

            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined">logout</span>Logout</div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
