// client/src/components/AuthTest.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, verifyOtp, signin, logout, reset } from '../features/authSlice';

function AuthTest() {
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    userPassword: '',
    otpCode: '',
  });
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { userEmail, userName, userPassword, otpCode } = formData;

  const dispatch = useDispatch();
  const { user, token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
    }
    if (isSuccess && message === 'OTP sent to email') {
      setIsOtpSent(true);
      alert(message);
    }
    if (isSuccess && user && token && message === 'User created successfully') {
      alert(`User created and logged in: ${user.userName}`);
      setIsOtpSent(false); // Reset for next signup
    }
    if (isSuccess && user && token && message === 'Signin successful') {
      alert(`Logged in: ${user.userName}`);
    }
    dispatch(reset()); // Clear state after effects
  }, [user, token, isError, isSuccess, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(signup({ userEmail, userName, userPassword }));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ userEmail, otpCode, userName, userPassword }));
  };

  const handleSignin = (e) => {
    e.preventDefault();
    dispatch(signin({ userEmail, userPassword }));
  };

  const handleLogout = () => {
    dispatch(logout());
    alert('Logged out!');
  };

  return (
    <div>
      <h2>Auth Test</h2>
      {isLoading && <p>Loading...</p>}
      {!user ? (
        <>
          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSignup}>
            <input
              type="email"
              name="userEmail"
              value={userEmail}
              onChange={onChange}
              placeholder="Email"
              required
            />
            {!isOtpSent && (
              <>
                <input
                  type="text"
                  name="userName"
                  value={userName}
                  onChange={onChange}
                  placeholder="Name"
                  required
                />
                <input
                  type="password"
                  name="userPassword"
                  value={userPassword}
                  onChange={onChange}
                  placeholder="Password"
                  required
                />
                <button type="submit">Sign Up</button>
              </>
            )}
            {isOtpSent && (
              <>
                <input
                  type="text"
                  name="otpCode"
                  value={otpCode}
                  onChange={onChange}
                  placeholder="OTP Code"
                  required
                />
                <button type="submit">Verify OTP & Create Account</button>
              </>
            )}
          </form>
          <h3>Already have an account?</h3>
          <form onSubmit={handleSignin}>
            <input
              type="email"
              name="userEmail"
              value={userEmail}
              onChange={onChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="userPassword"
              value={userPassword}
              onChange={onChange}
              placeholder="Password"
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </>
      ) : (
        <div>
          <p>Welcome, {user.userName}!</p>
          <p>Token: {token ? token.substring(0, 30) + '...' : 'N/A'}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default AuthTest;