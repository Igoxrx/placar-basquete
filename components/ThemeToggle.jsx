"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <button 
      className="btn btn-outline-secondary d-flex align-items-center gap-2" 
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <><i className="bi bi-moon-fill"></i> Tema Escuro</>
      ) : (
        <><i className="bi bi-sun-fill"></i> Tema Claro</>
      )}
    </button>
  );
}