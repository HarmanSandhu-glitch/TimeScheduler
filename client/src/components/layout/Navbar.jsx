import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/authSlice';
import useThemeToggle from '../../hooks/useThemeToggle'; // Import the hook

// Simple Sun/Moon Icons (replace with better SVGs if desired)
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12H.75m.386-6.364l1.591 1.591M12 6.75A5.25 5.25 0 006.75 12a5.25 5.25 0 005.25 5.25 5.25 5.25 0 005.25-5.25A5.25 5.25 0 0012 6.75z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>;


function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [theme, toggleTheme] = useThemeToggle(); // Use the hook

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/signin');
  };

  return (
    <nav className="bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface p-4 shadow-sm sticky top-0 z-10 border-b border-outline/20 dark:border-dark-outline/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-medium text-primary dark:text-dark-primary hover:opacity-80 transition-opacity">
          TimeScheduler
        </Link>
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="button-icon" // Use icon button style
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {user ? (
            <>
              {/* Rest of the user authenticated links */}
              <span className="hidden sm:inline text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                Welcome, {user.name}!
              </span>
              <button
                onClick={handleLogout}
                className="button-text text-error dark:text-dark-error hover:bg-error/10 dark:hover:bg-dark-error/10 focus:ring-error dark:focus:ring-dark-error px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Rest of the guest links */}
              <Link to="/signin" className="button-text px-4 py-2">
                Sign In
              </Link>
              <Link to="/signup" className="button-primary px-4 py-2 text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;