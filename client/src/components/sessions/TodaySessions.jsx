import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createDailySessions,
  getSessionsByDate,
  updateSessionStatus,
  updateSessionTask,
  updateSpecialNote,
  reset as resetSessions,
} from '../../features/sessionSlice';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

// --- Material You Priority Colors (Adjust if needed) ---
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
    bg: 'bg-surface dark:bg-dark-surface', // Use base surface for empty slots maybe?
    text: 'text-on-surface-variant dark:text-dark-on-surface-variant',
    border: 'border-outline/20 dark:border-dark-outline/20',
    indicator: 'bg-outline dark:bg-dark-outline',
  }
};
// --- End Priority Colors ---

function TodaySessions({ tasks = [] }) {
  const [selectedSessionIdForEdit, setSelectedSessionIdForEdit] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [selectedTaskIdForEdit, setSelectedTaskIdForEdit] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const dispatch = useDispatch();
  const [today] = useState(() => new Date().toISOString().split('T')[0]); // Memoize today's date
  const { user } = useSelector((state) => state.auth);
  const { sessions, isLoading, isError, message } = useSelector(
    (state) => state.sessions
  );

  useEffect(() => {
    if (user) {
      dispatch(createDailySessions({ sessionDate: today }))
        .unwrap()
        .then(() => dispatch(getSessionsByDate(today)))
        .catch(err => console.error("Failed to create or fetch sessions:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, today]); // Removed dispatch, it's stable

  useEffect(() => {
    if (isError) {
      showToast(message || 'An error occurred', 'error');
    }
  }, [isError, message]); // Don't reset on error, it causes loops

  const handleUpdateStatus = (sessionId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    dispatch(updateSessionStatus({ sessionId, status: newStatus }))
      .unwrap()
      .then(() => {
        showToast(`Session marked as ${newStatus}`, 'success', 2000);
      })
      .catch((err) => {
        showToast('Failed to update session status', 'error');
      });
  };

  const handleOpenEdit = (session) => {
    setSelectedSessionIdForEdit(session._id);
    setCurrentNote(session.sessionSpecialNote || '');
    setSelectedTaskIdForEdit(session.sessionTask?._id || session.sessionTask || ''); // Handle populated vs ID
  };

  const handleSaveEdit = () => {
     if (!selectedSessionIdForEdit || isLoading) return;
     const session = sessions.find(s => s._id === selectedSessionIdForEdit);
     if (!session) return;
     
     let promises = [];
     const taskChanged = selectedTaskIdForEdit !== (session.sessionTask?._id || session.sessionTask || '');
     const noteChanged = currentNote !== (session.sessionSpecialNote || '');
     
     if (taskChanged) {
         promises.push(dispatch(updateSessionTask({ sessionId: selectedSessionIdForEdit, taskId: selectedTaskIdForEdit || null })).unwrap());
     }
     if (noteChanged) {
         promises.push(dispatch(updateSpecialNote({ sessionId: selectedSessionIdForEdit, note: currentNote })).unwrap());
     }
     
     if (promises.length === 0) {
         setSelectedSessionIdForEdit('');
         return;
     }
     
     Promise.all(promises)
         .then(() => {
             setSelectedSessionIdForEdit('');
             showToast('Session updated successfully', 'success', 2000);
         })
         .catch((err) => {
             showToast('Failed to save changes. Please try again.', 'error');
         });
  };

  // Shared styles
  const inputClasses = "input-base";
  const selectClasses = inputClasses;
  const labelClasses = "label-base";
  const primaryButtonClasses = "button-primary";
  const textButtonClasses = "button-text";

  // --- Logic for table rendering ---
  const hours = [];
  const timeSlotsMinutes = new Set(); // Store only minutes (e.g., '00', '15', '30')

  sessions.forEach(session => {
    const hour = session.sessionStartTime.substring(0, 2);
    if (!hours.includes(hour)) {
      hours.push(hour);
    }
    timeSlotsMinutes.add(session.sessionStartTime.substring(3, 5));
  });

  hours.sort();
  const sortedTimeSlotsMinutes = Array.from(timeSlotsMinutes).sort();

  const sessionsMap = new Map(); // Use Map for easier lookup
  sessions.forEach(session => {
    sessionsMap.set(session.sessionStartTime, session); // Key: "HH:MM"
  });
  // --- End table logic ---

  if (isLoading && sessions.length === 0) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner size="lg" />
        <p className="text-secondary dark:text-dark-secondary mt-4">Loading today's sessions...</p>
      </div>
    );
  }
  if (!user) {
    return <p className="text-center text-error dark:text-dark-error py-4">Please sign in to view sessions.</p>;
  }
   if (!isLoading && sessions.length === 0) {
      return (
          <div className="text-center py-6">
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-4">No sessions found for {today}.</p>
              <button onClick={() => dispatch(createDailySessions({ sessionDate: today }))} className={primaryButtonClasses} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Generating...</span>
                    </span>
                  ) : 'Generate Today\'s Sessions'}
              </button>
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
                <th scope="row" className="py-3 px-4 font-medium text-on-surface dark:text-dark-on-surface whitespace-nowrap sticky left-0 bg-inherit z-10"> {/* Sticky Hour Column Body */}
                  {parseInt(hour, 10)}:00
                </th>
                {sortedTimeSlotsMinutes.map(slotMinutes => {
                  const timeKey = `${hour}:${slotMinutes}`;
                  const session = sessionsMap.get(timeKey);
                  const assignedTask = session ? tasks.find(t => t._id === (session.sessionTask?._id || session.sessionTask)) : null;
                  const colors = assignedTask ? (priorityColors[assignedTask.taskPriority] || priorityColors.Medium) : priorityColors.None;
                  const isCompleted = session?.sessionStatus === 'Completed';

                  return (
                    <td key={slotMinutes} className={`py-3 px-4 align-top border-l border-outline/10 dark:border-dark-outline/10 ${isCompleted ? 'opacity-60' : ''}`}>
                      {session ? (
                        <div className={`relative group space-y-1.5 p-2 rounded-lg ${isCompleted ? 'bg-transparent' : colors.bg + ' shadow-sm'}`}> {/* Conditional bg */}
                          {/* Checkbox */}
                          <div className="flex items-center space-x-2">
                             <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() => handleUpdateStatus(session._id, session.sessionStatus)}
                                className={`form-checkbox h-4 w-4 rounded border-2 ${isCompleted ? 'text-primary dark:text-dark-primary border-primary dark:border-dark-primary' : 'text-primary dark:text-dark-primary border-outline dark:border-dark-outline'} bg-surface dark:bg-dark-surface focus:ring-primary dark:focus:ring-dark-primary focus:ring-offset-0`}
                              />
                            <span className={`text-xs font-medium ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant line-through' : colors.text}`}>
                              {session.sessionStartTime}
                            </span>
                          </div>

                          {/* Task Info */}
                          {assignedTask ? (
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 ${colors.indicator} rounded-full flex-shrink-0`}></span>
                              <p className={`text-xs font-medium ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant line-through' : colors.text} truncate`}>
                                {assignedTask.taskName}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs italic text-on-surface-variant dark:text-dark-on-surface-variant">
                              No task
                            </p>
                          )}

                           {/* Note Tooltip */}
                           {session.sessionSpecialNote && (
                              <div className="absolute z-10 hidden group-hover:block bg-inverse-surface dark:bg-dark-inverse-surface text-inverse-on-surface dark:text-dark-inverse-on-surface text-xs rounded py-1 px-2 -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg transition-opacity duration-200">
                                {session.sessionSpecialNote}
                                 <svg className="absolute text-inverse-surface dark:text-dark-inverse-surface h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                              </div>
                            )}

                          {/* Edit Button */}
                          <div className="pt-1">
                              <button
                                  onClick={() => handleOpenEdit(session)}
                                  className={`button-icon text-xs ${isCompleted ? 'text-on-surface-variant dark:text-dark-on-surface-variant' : colors.text} hover:bg-black/10 dark:hover:bg-white/10 w-6 h-6`} // Smaller icon button
                                  title="Edit Session Details"
                              >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                              </button>
                          </div>

                        </div>
                      ) : (
                        // Empty slot representation (optional)
                         <div className="h-16"></div> // Placeholder for consistent height
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Edit Session Modal (Same as before) */}
       {selectedSessionIdForEdit && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
          <div className="bg-surface dark:bg-dark-surface p-6 rounded-3xl shadow-xl w-full max-w-md space-y-4">
             <h3 className="text-xl font-medium text-on-surface dark:text-dark-on-surface">Edit Session Details</h3>
             <div className="space-y-4">
              {/* Task Assignment */}
              <div>
                <label htmlFor="editTask" className={labelClasses}>Assign Task:</label>
                <select
                  id="editTask"
                  value={selectedTaskIdForEdit}
                  onChange={(e) => setSelectedTaskIdForEdit(e.target.value)}
                  className={selectClasses}
                >
                  <option value="">-- No Task --</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      ({task.taskPriority}) {task.taskName}
                    </option>
                  ))}
                </select>
              </div>

               {/* Special Note */}
              <div>
                <label htmlFor="editNote" className={labelClasses}>Special Note:</label>
                <input
                  id="editNote"
                  type="text"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  className={inputClasses}
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
                type="button" // Change type to button, handle save in onClick
                onClick={handleSaveEdit}
                className={primaryButtonClasses}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
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
  );
}

export default TodaySessions;