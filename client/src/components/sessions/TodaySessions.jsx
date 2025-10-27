import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useSelector, useDispatch } from 'react-redux';
import {
  // Removed createDailySessions and getSessionsByDate imports
  updateSessionStatus,
  updateSessionTask,
  updateSpecialNote,
  reset as resetSessions, // Keep reset if needed elsewhere, but not for fetching here
} from '../../features/sessionSlice';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import { PRIORITY_COLORS } from '../../constants/app.constants'; // Import priority colors


// --- Priority Colors (copied from TaskControl for consistency, consider centralizing) ---
const priorityColors = {
  High: {
    bg: 'bg-error-container dark:bg-dark-error-container',
    text: 'text-on-error-container dark:text-dark-on-error-container',
    border: 'border-error/50 dark:border-dark-error/50',
    indicator: 'bg-error dark:bg-dark-error',
  },
  Medium: {
    bg: 'bg-secondary-container dark:bg-dark-secondary-container',
    text: 'text-on-secondary-container dark:text-dark-on-secondary-container',
    border: 'border-secondary/50 dark:border-dark-secondary/50',
    indicator: 'bg-secondary dark:bg-dark-secondary',
  },
  Low: {
    bg: 'bg-tertiary-container dark:bg-dark-tertiary-container', // Using tertiary for low
    text: 'text-on-tertiary-container dark:text-dark-on-tertiary-container',
    border: 'border-tertiary/50 dark:border-dark-tertiary/50',
    indicator: 'bg-tertiary dark:bg-dark-tertiary',
  },
  None: { // For unassigned tasks
    bg: 'bg-surface dark:bg-dark-surface',
    text: 'text-on-surface-variant dark:text-dark-on-surface-variant',
    border: 'border-outline/20 dark:border-dark-outline/20',
    indicator: 'bg-outline dark:bg-dark-outline',
  }
};
// --- End Priority Colors ---

function TodaySessions({ tasks = [] }) { // Receive tasks as props
  const [selectedSessionIdForEdit, setSelectedSessionIdForEdit] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [selectedTaskIdForEdit, setSelectedTaskIdForEdit] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const dispatch = useDispatch();
  const [today] = useState(() => new Date().toISOString().split('T')[0]); // Keep today's date
  const { user } = useSelector((state) => state.auth);
  // Select daily sessions and loading state from the store, fetched by Home.jsx
  const { sessions, isLoading, isError, message } = useSelector(
    (state) => state.sessions
  );

  // REMOVED the useEffect block that fetched sessions here.
  // Home.jsx is now responsible for fetching dailySessions.

  // Effect to show error messages related to session updates
  useEffect(() => {
    if (isError && message) { // Only show if there's a message
      showToast(message, 'error');
      // Optionally reset the error state in the slice after showing
      // dispatch(resetSessions()); // Or a specific action like `clearSessionError()`
    }
    // Dependency array should include isError and message
  }, [isError, message, showToast]); // Removed dispatch for now to avoid potential loops


  const handleUpdateStatus = (sessionId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    dispatch(updateSessionStatus({ sessionId, status: newStatus }))
      .unwrap()
      .then(() => {
        showToast(`Session marked as ${newStatus}`, 'success', 2000);
      })
      .catch((err) => {
        // Error is handled by the useEffect above, but you could add specific messages here if needed
        console.error("Failed to update session status:", err);
        // showToast('Failed to update session status', 'error');
      });
  };

  const handleOpenEdit = (session) => {
    setSelectedSessionIdForEdit(session._id);
    setCurrentNote(session.sessionSpecialNote || '');
    // Handle both populated object and plain ID string
    const currentTaskId = session.sessionTask?._id || session.sessionTask || '';
    setSelectedTaskIdForEdit(currentTaskId);
  };


  const handleSaveEdit = () => {
    if (!selectedSessionIdForEdit || isLoading) return;

    // Find the original session state to compare against
    const originalSession = sessions.find(s => s._id === selectedSessionIdForEdit);
    if (!originalSession) return; // Should not happen

    const originalTaskId = originalSession.sessionTask?._id || originalSession.sessionTask || '';
    const originalNote = originalSession.sessionSpecialNote || '';

    let promises = [];
    const taskChanged = selectedTaskIdForEdit !== originalTaskId;
    // Ensure comparison handles null/undefined/empty string consistently
    const noteChanged = (currentNote || '') !== originalNote;

    if (taskChanged) {
      console.log(`Task changed for ${selectedSessionIdForEdit}: ${originalTaskId} -> ${selectedTaskIdForEdit || null}`);
      promises.push(dispatch(updateSessionTask({ sessionId: selectedSessionIdForEdit, taskId: selectedTaskIdForEdit || null })).unwrap());
    }
    if (noteChanged) {
      console.log(`Note changed for ${selectedSessionIdForEdit}: "${originalNote}" -> "${currentNote || ''}"`);
      promises.push(dispatch(updateSpecialNote({ sessionId: selectedSessionIdForEdit, note: currentNote || '' })).unwrap());
    }

    if (promises.length === 0) {
      setSelectedSessionIdForEdit(''); // No changes, just close
      return;
    }

    Promise.all(promises)
      .then(() => {
        setSelectedSessionIdForEdit(''); // Close modal on success
        showToast('Session updated successfully', 'success', 2000);
      })
      .catch((err) => {
        // Error is handled by the useEffect
        console.error("Failed to save session edits:", err);
        // showToast('Failed to save changes. Please try again.', 'error');
      });
  };

  // Shared styles
  const inputClasses = "input-base";
  const selectClasses = inputClasses;
  const labelClasses = "label-base";
  const primaryButtonClasses = "button-primary";
  const textButtonClasses = "button-text";

  // --- Logic for table rendering (Memoized) ---
  const { hours, sortedTimeSlotsMinutes, sessionsMap } = useMemo(() => {
    const hoursSet = new Set();
    const timeSlotsMinutesSet = new Set();
    const map = new Map();

    sessions.forEach(session => {
      if (session.sessionStartTime) {
        const hour = session.sessionStartTime.substring(0, 2);
        hoursSet.add(hour);
        timeSlotsMinutesSet.add(session.sessionStartTime.substring(3, 5));
        map.set(session.sessionStartTime, session); // Key: "HH:MM"
      }
    });

    const sortedHours = Array.from(hoursSet).sort();
    const sortedMinutes = Array.from(timeSlotsMinutesSet).sort();

    return { hours: sortedHours, sortedTimeSlotsMinutes: sortedMinutes, sessionsMap: map };
  }, [sessions]); // Recalculate only when sessions change
  // --- End table logic ---

  // Display loading spinner if sessions are loading (controlled by Home.jsx)
  if (isLoading && sessions.length === 0) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner size="lg" />
        <p className="text-secondary dark:text-dark-secondary mt-4">Loading today's schedule...</p>
      </div>
    );
  }

  // Handle case where user isn't logged in (should be handled by Home routing, but as fallback)
  if (!user) {
    return <p className="text-center text-error dark:text-dark-error py-4">Please sign in to view sessions.</p>;
  }

  // Handle case where sessions array is empty after loading finishes
  // Note: Home.jsx handles the initial creation/fetch logic. This state means fetch completed but found nothing.
  if (!isLoading && sessions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
          No sessions found or generated for {today}. Check settings or try refreshing.
        </p>
        {/* Optional: Add a manual refresh button, but be cautious */}
        {/* <button onClick={() => dispatch(getSessionsByDate(today))} className={primaryButtonClasses} disabled={isLoading}>
                  {isLoading ? 'Refreshing...' : 'Refresh Schedule'}
              </button> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto relative shadow-md rounded-2xl border border-outline/20 dark:border-dark-outline/20">
        <table className="w-full text-sm text-left text-on-surface dark:text-dark-on-surface">
          <thead className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant uppercase bg-surface dark:bg-dark-surface border-b border-outline/20 dark:border-dark-outline/20">
            <tr>
              <th scope="col" className="py-3 px-4 w-24 sticky left-0 bg-surface dark:bg-dark-surface z-10"> {/* Sticky Hour Column */}
                Hour
              </th>
              {sortedTimeSlotsMinutes.map(slotMinutes => (
                <th key={slotMinutes} scope="col" className="py-3 px-4 min-w-[200px]"> {/* Min width for slots */}
                  :{slotMinutes}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour} className="bg-surface dark:bg-dark-surface border-b border-outline/20 dark:border-dark-outline/20 last:border-b-0 hover:bg-surface-variant/30 dark:hover:bg-dark-surface-variant/30 transition-colors">
                {/* Sticky Hour Column Body */}
                <th scope="row" className="py-3 px-4 font-medium text-on-surface dark:text-dark-on-surface whitespace-nowrap sticky left-0 bg-inherit z-10">
                  {parseInt(hour, 10)}:00
                </th>
                {sortedTimeSlotsMinutes.map(slotMinutes => {
                  const timeKey = `${hour}:${slotMinutes}`;
                  const session = sessionsMap.get(timeKey);

                  // Find assigned task using task ID from session
                  const assignedTask = session ? tasks.find(t => t._id === (session.sessionTask?._id || session.sessionTask)) : null;
                  const colors = assignedTask ? (priorityColors[assignedTask.taskPriority] || priorityColors.Medium) : priorityColors.None;
                  const isCompleted = session?.sessionStatus === 'Completed';

                  return (
                    <td key={slotMinutes} className={`py-3 px-4 align-top border-l border-outline/10 dark:border-dark-outline/10 ${isCompleted ? 'opacity-60' : ''}`}>
                      {session ? (
                        // Conditional bg and shadow based on completion and assignment
                        <div className={`relative group space-y-1.5 p-2 rounded-lg ${isCompleted ? 'bg-transparent' : (assignedTask ? colors.bg + ' shadow-sm' : 'bg-surface-variant/40 dark:bg-dark-surface-variant/40')}`}>
                          {/* Checkbox */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleUpdateStatus(session._id, session.sessionStatus)}
                              disabled={isLoading} // Disable while any session action is loading
                              className={`form-checkbox h-4 w-4 rounded border-2 ${isCompleted ? 'text-primary dark:text-dark-primary border-primary dark:border-dark-primary' : 'text-primary dark:text-dark-primary border-outline dark:border-dark-outline'} bg-surface dark:bg-dark-surface focus:ring-primary dark:focus:ring-dark-primary focus:ring-offset-0 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed`}
                            />
                            <span className={`text-xs font-medium ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant line-through' : colors.text}`}>
                              {session.sessionStartTime} - {session.sessionEndTime}
                            </span>
                          </div>

                          {/* Task Info */}
                          {assignedTask ? (
                            <div className="flex items-center space-x-1.5 min-h-[16px]"> {/* Ensure minimum height */}
                              <span className={`w-2 h-2 ${colors.indicator} rounded-full flex-shrink-0`}></span>
                              <p className={`text-xs font-medium ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant line-through' : colors.text} truncate`} title={assignedTask.taskName}>
                                {assignedTask.taskName}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs italic text-on-surface-variant dark:text-dark-on-surface-variant min-h-[16px]">
                              {isCompleted ? '' : 'No task'} {/* Hide "No task" if completed */}
                            </p>
                          )}

                          {/* Note Indicator & Tooltip */}
                          {session.sessionSpecialNote && (
                            <div className="absolute z-10 bottom-1 right-1 hidden group-hover:block bg-inverse-surface dark:bg-dark-inverse-surface text-inverse-on-surface dark:text-dark-inverse-on-surface text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg transition-opacity duration-200">
                              {session.sessionSpecialNote}
                              {/* Tooltip Arrow */}
                              <svg className="absolute text-inverse-surface dark:text-dark-inverse-surface h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                          )}
                          {/* Note icon visible even without hover if note exists */}
                          {session.sessionSpecialNote && !isCompleted && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3 h-3 absolute top-1.5 right-1.5 ${isCompleted ? 'text-outline/50 dark:text-dark-outline/50' : colors.text} opacity-70 group-hover:opacity-0`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          )}

                          {/* Edit Button - Conditionally visible */}
                          <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 left-1">
                            <button
                              onClick={() => handleOpenEdit(session)}
                              // Use text color matching the task or default variant
                              className={`button-icon text-xs ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant' : colors.text} hover:bg-black/10 dark:hover:bg-white/10 w-6 h-6`}
                              title="Edit Session Details"
                              disabled={isLoading} // Disable while any session action is loading
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>
                          </div>

                        </div>
                      ) : (
                        // Empty slot representation
                        <div className="h-20"></div> // Placeholder for consistent height
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Session Modal */}
      {selectedSessionIdForEdit && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
          <div className="bg-surface dark:bg-dark-surface p-6 rounded-3xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-medium text-on-surface dark:text-dark-on-surface">Edit Session Details</h3>
            <div className="space-y-4">
              {/* Task Assignment Dropdown */}
              <div>
                <label htmlFor="editTask" className={labelClasses}>Assign Task:</label>
                <select
                  id="editTask"
                  value={selectedTaskIdForEdit}
                  onChange={(e) => setSelectedTaskIdForEdit(e.target.value)}
                  className={selectClasses}
                  disabled={isLoading}
                >
                  <option value="">-- No Task --</option>
                  {/* Sort tasks maybe? By name or priority? */}
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      ({task.taskPriority}) {task.taskName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Note Input */}
              <div>
                <label htmlFor="editNote" className={labelClasses}>Special Note (Optional):</label>
                <input
                  id="editNote"
                  type="text"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Add a brief note..."
                  maxLength={100} // Add a max length
                  className={inputClasses}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSessionIdForEdit('')}
                className={textButtonClasses}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button" // Use type="button" and handle save via onClick
                onClick={handleSaveEdit}
                className={primaryButtonClasses}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /* SVG spinner */ xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default TodaySessions;