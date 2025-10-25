import { useState, useEffect } from 'react';

const useThemeToggle = () => {
    // Initialize state from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        // You could also check system preference here if desired initially
        // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme || 'light'; // Default to light
    });

    useEffect(() => {
        const root = window.document.documentElement; // Get the <html> element
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        // Save the current theme preference to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]); // Re-run effect whenever theme changes

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return [theme, toggleTheme];
};

export default useThemeToggle;