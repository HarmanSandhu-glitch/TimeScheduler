import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signin, reset } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });

  const { userEmail, userPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let shouldReset = true;
    if (isError) {
      // Basic alert, consider a toast notification library
      alert(`Error: ${message}`);
    } else if (isSuccess && user) {
      // No alert needed for success, just redirect
      navigate('/');
      shouldReset = false; // Don't reset right after successful login
    }

    if (shouldReset) {
      dispatch(reset());
    }

  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Cleanup reset on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
    }
  }, [dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignin = (e) => {
    e.preventDefault();
    if (!isLoading) {
       dispatch(signin({ userEmail, userPassword }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background px-4 py-12">
      <div className="card-base max-w-md w-full"> {/* Use card-base */}
        <h2 className="text-3xl font-medium text-center text-primary dark:text-dark-primary mb-8">
          Sign In
        </h2>
        {/* Loading indicator could be more subtle, like inside the button */}
        {/* {isLoading && <p className="text-center text-secondary dark:text-dark-secondary mb-4">Loading...</p>} */}
        {/* Display error message */}
        {isError && !isLoading && <p className="text-center text-error dark:text-dark-error mb-4 text-sm">{message}</p>}

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <label htmlFor="userEmail" className="label-base"> {/* Use label-base */}
              Email address
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={userEmail}
              onChange={onChange}
              placeholder="you@example.com"
              required
              className="input-base" // Use input-base
            />
          </div>
          <div>
            <label htmlFor="userPassword" className="label-base">
              Password
            </label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              value={userPassword}
              onChange={onChange}
              placeholder="********"
              required
              className="input-base"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full" // Use button-primary
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary dark:text-dark-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;