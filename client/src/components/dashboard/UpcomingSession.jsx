import React from 'react';
import { format, getHours, getMinutes } from 'date-fns';
import { PRIORITY_COLORS } from '../../constants/app.constants'; // Import priority colors

// Helper function to convert HH:MM to minutes since midnight
const timeToMinutes = (timeString) => {
    if (!timeString || !timeString.includes(':')) return -1;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

// Define priority order for sorting
const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
};

function UpcomingSession({ dailySessions = [], tasks = [] }) {
    const now = new Date();
    const currentHour = getHours(now);
    const currentMinute = getMinutes(now);
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Filter sessions: must be assigned, pending, in the current hour, and start after the current time
    const upcomingSessionsInHour = dailySessions.filter(session => {
        const sessionStartMinutes = timeToMinutes(session.sessionStartTime);
        const sessionHour = Math.floor(sessionStartMinutes / 60);

        return session.sessionTask && // Must be assigned
               session.sessionStatus === 'Pending' && // Must be pending
               sessionHour === currentHour && // Must be in the current hour
               sessionStartMinutes > currentTimeInMinutes; // Must start after the current time
    });

    // If there are upcoming sessions, enrich with task details and sort by priority
    let nextSession = null;
    if (upcomingSessionsInHour.length > 0) {
        const enrichedSessions = upcomingSessionsInHour.map(session => {
            const task = tasks.find(t => t._id === (session.sessionTask?._id || session.sessionTask));
            return {
                ...session,
                taskDetails: task || null, // Add task details
                priorityValue: task ? (priorityOrder[task.taskPriority] || 3) : 3 // Assign numeric priority for sorting
            };
        }).filter(session => session.taskDetails); // Ensure task details are available

        // Sort by priority (High first), then by start time
        enrichedSessions.sort((a, b) => {
            if (a.priorityValue !== b.priorityValue) {
                return a.priorityValue - b.priorityValue;
            }
            return timeToMinutes(a.sessionStartTime) - timeToMinutes(b.sessionStartTime);
        });

        nextSession = enrichedSessions[0]; // Get the highest priority, earliest session
    }

    // Get color based on priority
    const colors = nextSession?.taskDetails
        ? (PRIORITY_COLORS[nextSession.taskDetails.taskPriority] || PRIORITY_COLORS.Medium)
        : PRIORITY_COLORS.None;

    return (
        <div className={`card-container ${!nextSession ? 'flex items-center justify-center' : ''}`}> {/* Center content if no session */}
            <h3 className="text-lg font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-4 text-center shrink-0">
                Next This Hour
            </h3>
            {nextSession ? (
                <div className={`p-4 rounded-xl ${colors.bg} shadow`}>
                    <p className={`text-sm font-medium ${colors.text} mb-1`}>
                        🕒 {nextSession.sessionStartTime} - {nextSession.sessionEndTime}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 ${colors.indicator} rounded-full flex-shrink-0`}></span>
                        <p className={`text-base font-semibold ${colors.text} truncate`} title={nextSession.taskDetails.taskName}>
                            {nextSession.taskDetails.taskName}
                        </p>
                    </div>
                     <p className={`text-xs ${colors.text} opacity-80 mt-1`}>
                        Priority: {nextSession.taskDetails.taskPriority}
                    </p>
                    {nextSession.sessionSpecialNote && (
                         <p className={`text-xs ${colors.text} opacity-90 mt-2 border-t border-current/20 pt-1.5`} title={nextSession.sessionSpecialNote}>
                            Note: {nextSession.sessionSpecialNote}
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-center text-sm text-on-surface-variant/70 dark:text-dark-on-surface-variant/70">
                    No upcoming assigned sessions this hour.
                </p>
            )}
        </div>
    );
}

export default UpcomingSession;