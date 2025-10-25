import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, verifyOtp, reset } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
        userPassword: '',
        otpCode: '',
    });
    const [isOtpSent, setIsOtpSent] = useState(false);

    const { userEmail, userName, userPassword, otpCode } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        let shouldReset = true;

        if (isError) {
            alert(`Error: ${message}`);
        } else if (isSuccess) {
            if (message === 'OTP sent to email') {
                setIsOtpSent(true);
                // alert(message); // Maybe show a more subtle confirmation
                shouldReset = false;
            } else if (user && message === 'User created successfully') {
                navigate('/');
                shouldReset = false;
            }
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

    const handleSignup = (e) => {
        e.preventDefault();
        if (!isLoading) {
            dispatch(signup({ userEmail, userName, userPassword }));
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (!isLoading) {
            dispatch(verifyOtp({ userEmail, otpCode, userName, userPassword }));
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background px-4 py-12">
            <div className="card-base max-w-md w-full"> {/* Use card-base */}
                <h2 className="text-3xl font-medium text-center text-primary dark:text-dark-primary mb-8">
                    Create Account
                </h2>
                {isError && !isLoading && <p className="text-center text-error dark:text-dark-error mb-4 text-sm">{message}</p>}
                {isSuccess && message === 'OTP sent to email' && !isError && (
                    <p className="text-center text-green-600 dark:text-green-400 mb-4 text-sm">OTP sent to {userEmail}. Check your inbox.</p>
                )}

                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="userEmail" className="label-base">
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
                            disabled={isOtpSent || isLoading}
                            className="input-base disabled:opacity-70" // Use input-base
                        />
                    </div>

                    {!isOtpSent && (
                        <>
                            <div>
                                <label htmlFor="userName" className="label-base">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={userName}
                                    onChange={onChange}
                                    placeholder="Your Name"
                                    required
                                    disabled={isLoading}
                                    className="input-base"
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
                                    placeholder="******** (min. 6 characters)"
                                    required
                                    minLength="6"
                                    disabled={isLoading}
                                    className="input-base"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="button-primary w-full" // Use button-primary
                                >
                                    {isLoading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>) : null}
                                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </>
                    )}

                    {isOtpSent && (
                        <div>
                            <label htmlFor="otpCode" className="label-base">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                id="otpCode"
                                name="otpCode"
                                value={otpCode}
                                onChange={onChange}
                                placeholder="Enter OTP from email"
                                required
                                disabled={isLoading}
                                className="input-base"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="button-primary w-full mt-6" // Use button-primary
                            >
                                {isLoading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>) : null}
                                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                            </button>
                        </div>
                    )}
                </form>
                <p className="mt-8 text-center text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                    Already have an account?{' '}
                    <Link
                        to="/signin"
                        className="font-medium text-primary dark:text-dark-primary hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;