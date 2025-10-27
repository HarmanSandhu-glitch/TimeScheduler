import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, subDays } from 'date-fns';
import TodaySessions from '../components/sessions/TodaySessions';
import TaskControl from '../components/tasks/TaskControl';
import { getTasks, reset as resetTasks } from '../features/taskSlice';
import { getSessionsByDate, getSessionsByRange, reset as resetSessions, createDailySessions } from '../features/sessionSlice';
// Charts (Ensure SessionAssignmentChart is removed/commented out)
import SessionStatusChart from '../components/dashboard/SessionStatusChart';
// import SessionAssignmentChart from '../components/dashboard/SessionAssignmentChart'; // REMOVED
import WeeklyCompletionChart from '../components/dashboard/WeeklyCompletionChart';
import MonthlyCompletionChart from '../components/dashboard/MonthlyCompletionChart';
import UpcomingSession from '../components/dashboard/UpcomingSession';
import { useNavigate } from 'react-router-dom';
import UserProfileUpdate from '../components/profile/UserProfileUpdate';

// Placeholder SettingsIcon
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.905c-.007.378.138.75.431.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-1.905c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { tasks = [] } = useSelector((state) => state.tasks);
    const { sessions: dailySessions = [], isRangeLoading, rangedSessions = [], isLoading: isDailySessionsLoading } = useSelector((state) => state.sessions);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }

        // Fetch tasks only once
        if (tasks.length === 0) {
            dispatch(getTasks(user.id));
        }

        // Fetch today's sessions only once
        const today = format(new Date(), 'yyyy-MM-dd');
        if (dailySessions.length === 0) {
            dispatch(createDailySessions({ sessionDate: today }))
                .unwrap()
                .then(() => dispatch(getSessionsByDate(today)))
                .catch(err => console.error("Failed to ensure/fetch daily sessions:", err));
        }

        // Fetch ranged sessions only once
        if (rangedSessions.length === 0) {
            const endDateRange = format(new Date(), 'yyyy-MM-dd');
            const startDateRange = format(subDays(new Date(), 29), 'yyyy-MM-dd');
            dispatch(getSessionsByRange({ startDate: startDateRange, endDate: endDateRange }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]); // Only depend on user and navigate


    if (!user) {
        return <div className="text-center mt-20 text-on-surface-variant dark:text-dark-on-surface-variant">Redirecting...</div>;
    }

    const initialLoading = (isDailySessionsLoading && dailySessions.length === 0) || (tasks.length === 0 && !isDailySessionsLoading);

    return (
        <div className="space-y-8 py-6">
            <header className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium text-on-background dark:text-dark-on-background">Dashboard</h1>
                    <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-1 text-base">
                        Welcome back, {user?.name || 'User'}! 👋
                    </p>
                </div>
                <button onClick={() => setIsProfileModalOpen(true)} className="button-icon" title="Profile Settings">
                    <SettingsIcon />
                </button>
            </header>

            {initialLoading ? (
                <div className="text-center p-10 text-secondary dark:text-dark-secondary">Loading dashboard data...</div>
            ) : (
                <>
                    {/* Row for Upcoming Session & Status Chart */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UpcomingSession dailySessions={dailySessions} tasks={tasks} />
                        <div className="card-container">
                            {/* Pass dailySessions AND tasks */}
                            <SessionStatusChart dailySessions={dailySessions} tasks={tasks} />
                        </div>
                    </section>

                    {/* Overview Charts Row 2 - Weekly/Monthly */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pass rangedSessions data */}
                        <WeeklyCompletionChart sessionsData={rangedSessions} isLoading={isRangeLoading} />
                        <MonthlyCompletionChart sessionsData={rangedSessions} isLoading={isRangeLoading} />
                    </section>

                    {/* Task Management */}
                    <section className="card-container">
                        <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-5">Manage Your Tasks</h2>
                        <TaskControl />
                    </section>

                    {/* Today's Sessions List/Table */}
                    <section className="card-container">
                        <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-5">Today's Schedule</h2>
                        <TodaySessions tasks={tasks} />
                    </section>
                </>
            )}

            <UserProfileUpdate
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}

export default Home;