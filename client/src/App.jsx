import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import AuthTest from './components/AuthTest';
import TaskTest from './components/TaskTest';
import SessionTest from './components/SessionTest';

function App() {
  const location = useLocation();

  // Determine if Navbar should be shown (e.g., not on signin/signup)
  const showNavbar = !['/signin', '/signup'].includes(location.pathname);

  return (
    <ErrorBoundary>
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "container mx-auto p-4 sm:p-6 lg:p-8" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/" element={<Home />} />

          {/* Test Routes (optional - remove in production) */}
          <Route path="/authtest" element={<AuthTest />} />
          <Route path="/tasktest" element={<TaskTest />} />
          <Route path="/sessiontest" element={<SessionTest />} />

          {/* 404 Not Found */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-on-surface dark:text-dark-on-surface mb-4">404</h1>
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-6">Page not found</p>
              <a href="/" className="button-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
    </ErrorBoundary>
  );
}

export default App;