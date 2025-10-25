import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, resetUpdateStatus } from '../../features/authSlice';

// Simple close icon SVG
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

function UserProfileUpdate({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { user, isUpdateLoading, isUpdateError, isUpdateSuccess, updateMessage } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPassword: '', // Keep empty initially for security/UX
        userDayStartTime: '09:00', // Default or fetch if available
        userDayEndTime: '17:00',   // Default or fetch if available
        userSessionSize: 15,        // Default or fetch if available
    });
    const [showSuccess, setShowSuccess] = useState(false);

    // Pre-fill form when modal opens and user data is available
    useEffect(() => {
        if (user && isOpen) {
            setFormData((prev) => ({
                ...prev, // Keep password empty unless changed
                userName: user.name || '',
                userEmail: user.email || '',
                // Note: Scheduling preferences aren't in the basic user object from authSlice.
                // You would need to fetch these separately if you want to pre-fill them.
                // For now, they'll show defaults or last entered values.
            }));
            setShowSuccess(false); // Reset success message on open
            dispatch(resetUpdateStatus()); // Clear previous update status
        }
    }, [user, isOpen, dispatch]);

    // Handle success message display and auto-close
    useEffect(() => {
        if (isUpdateSuccess) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
                onClose(); // Close modal after showing success message
                dispatch(resetUpdateStatus()); // Reset status
            }, 2000); // Show for 2 seconds
            return () => clearTimeout(timer);
        }
    }, [isUpdateSuccess, onClose, dispatch]);

    // Reset status on close if not successful
    useEffect(() => {
        if (!isOpen) {
            dispatch(resetUpdateStatus());
            setShowSuccess(false); // Hide message if closed manually
        }
    }, [isOpen, dispatch]);


    const onChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user && !isUpdateLoading) {
            const userDataToUpdate = { ...formData };
            // Only include password if user actually typed something
            if (!userDataToUpdate.userPassword) {
                delete userDataToUpdate.userPassword;
            }
            dispatch(updateUser({ userId: user.id, userData: userDataToUpdate }));
        }
    };

    // Shared styles from index.css
    const inputClasses = "input-base";
    const selectClasses = inputClasses; // Can use same base style
    const labelClasses = "label-base";
    const primaryButtonClasses = "button-primary";
    const textButtonClasses = "button-text";

    if (!isOpen) {
        return null; // Don't render anything if the modal is closed
    }

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface p-6 rounded-3xl shadow-xl w-full max-w-lg space-y-4 relative"> {/* Max width lg */}
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="button-icon absolute top-4 right-4 text-secondary dark:text-dark-secondary"
                    aria-label="Close profile update"
                    disabled={isUpdateLoading}
                >
                    <CloseIcon />
                </button>

                <h3 className="text-xl font-medium text-on-surface dark:text-dark-on-surface text-center mb-2">
                    Update Profile & Settings
                </h3>

                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-primary-container dark:bg-dark-primary-container text-on-primary-container dark:text-dark-on-primary-container p-3 rounded-xl text-center text-sm animate-fade-in">
                        {updateMessage || 'Profile updated successfully!'}
                    </div>
                )}
                {/* Error Message */}
                {isUpdateError && !isUpdateLoading && (
                    <div className="bg-error-container dark:bg-dark-error-container text-on-error-container dark:text-dark-on-error-container p-3 rounded-xl text-center text-sm">
                        Error: {updateMessage || 'Failed to update profile.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="userName" className={labelClasses}>Name</label>
                            <input type="text" id="userName" name="userName" value={formData.userName} onChange={onChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="userEmail" className={labelClasses}>Email</label>
                            <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={onChange} required className={inputClasses} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="userPassword" className={labelClasses}>New Password (leave blank to keep current)</label>
                        <input type="password" id="userPassword" name="userPassword" value={formData.userPassword} onChange={onChange} placeholder="********" minLength="6" className={inputClasses} />
                    </div>
                    <hr className="border-outline/30 dark:border-dark-outline/30 my-6" />
                    <h4 className="text-lg font-medium text-on-surface dark:text-dark-on-surface mb-1">Scheduling Defaults</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="userDayStartTime" className={labelClasses}>Day Start Time</label>
                            <input type="time" id="userDayStartTime" name="userDayStartTime" value={formData.userDayStartTime} onChange={onChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="userDayEndTime" className={labelClasses}>Day End Time</label>
                            <input type="time" id="userDayEndTime" name="userDayEndTime" value={formData.userDayEndTime} onChange={onChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="userSessionSize" className={labelClasses}>Session Size (min)</label>
                            <input type="number" id="userSessionSize" name="userSessionSize" value={formData.userSessionSize} onChange={onChange} required min="5" max="120" step="5" className={inputClasses} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={textButtonClasses}
                            disabled={isUpdateLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={primaryButtonClasses}
                            disabled={isUpdateLoading}
                        >
                            {isUpdateLoading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /* SVG spinner */ >...</svg>
                            ) : null}
                            {isUpdateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfileUpdate;