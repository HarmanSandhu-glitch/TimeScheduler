import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { format, subDays } from 'date-fns'; // Use date-fns again

// Helper to process session data for the chart (last 30 days)
const processMonthlyData = (sessions) => {
    const completionByDay = {};
    const today = new Date();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const dayOfMonth = format(date, 'd'); // Day of the month ('1', '2', ..., '31')
        completionByDay[dateString] = { name: dayOfMonth, completed: 0, total: 0, date: dateString };
    }

    // Populate with session data
    sessions.forEach(session => {
        // Ensure sessionDate is valid and convert to Date object before formatting
        try {
            const sessionDateObj = new Date(session.sessionDate);
            if (!isNaN(sessionDateObj.getTime())) { // Check if date is valid
                const dateString = format(sessionDateObj, 'yyyy-MM-dd');
                if (completionByDay[dateString]) {
                    completionByDay[dateString].total++;
                    if (session.sessionStatus === 'Completed') {
                        completionByDay[dateString].completed++;
                    }
                }
            } else {
                console.warn("Invalid session date found:", session.sessionDate);
            }
        } catch (e) {
            console.error("Error processing session date:", session.sessionDate, e);
        }
    });

    // Calculate percentage and format for chart
    return Object.values(completionByDay).map(day => ({
        ...day,
        completionRate: day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0,
    }));
};

const MonthlyCompletionChart = ({ sessionsData = [], isLoading }) => {
    // Use localStorage to get theme preference - stable and doesn't cause re-renders
    const isDarkMode = useMemo(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }, []); // Empty deps - only calculate once

    // Define colors based on dark mode - memoized to prevent recalculation
    const colors = useMemo(() => ({
        axisTickColor: isDarkMode ? '#CAC4D0' : '#49454E',
        axisLineColor: isDarkMode ? '#938F99' : '#79747E',
        gridColor: isDarkMode ? "#49454E" : "#E7E0EC",
        secondaryColor: isDarkMode ? '#CCC2DC' : '#625B71', // Renamed from primaryColor
    }), [isDarkMode]);

    const chartData = useMemo(() => processMonthlyData(sessionsData || []), [sessionsData]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload; // Access original data
            return (
                <div className="bg-inverse-surface dark:bg-dark-inverse-surface text-inverse-on-surface dark:text-dark-inverse-on-surface p-2 rounded-lg shadow-md text-sm border border-outline/20 dark:border-dark-outline/20">
                    <p className="font-medium">{data.date}</p> {/* Show full date */}
                    <p className="text-xs">{`Completed: ${data.completed} / ${data.total}`}</p>
                    <p className="text-xs">{`Rate: ${data.completionRate}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card-container h-full flex flex-col min-h-[300px]"> {/* Consistent card styling */}
            <h3 className="text-lg font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-4 text-center shrink-0">
                Daily Completion (Last 30 Days)
            </h3>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-secondary dark:text-dark-secondary animate-pulse">Loading monthly data...</p>
                </div>
            ) : sessionsData && sessionsData.length > 0 ? (
                <div className="flex-grow"> {/* Chart container */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}> {/* Adjusted margins */}
                            {/* FIX: Use colors.gridColor instead of gridColor */}
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.gridColor} strokeOpacity={0.5} vertical={false} />
                            <XAxis
                                dataKey="name" // Show day of month (e.g., '1', '2')
                                tick={{ fill: colors.axisTickColor, fontSize: 10 }} // Smaller font for days
                                axisLine={{ stroke: colors.axisLineColor }}
                                tickLine={false}
                                // Adjust interval to prevent label overlap, e.g., show every 2nd or 3rd label
                                interval={Math.floor(chartData.length / 10)} // Show roughly 10 labels
                                tickFormatter={(value, index) => (index % 3 === 0 ? value : '')} // Example: Show every 3rd label
                            />
                            <YAxis
                                tick={{ fill: colors.axisTickColor, fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            >
                                <Label value="Completion %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: colors.axisTickColor, fontSize: '11px' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(202, 196, 208, 0.1)' : 'rgba(73, 69, 78, 0.1)' }} />
                            {/* Using secondaryColor for the bars */}
                            <Bar dataKey="completionRate" fill={colors.secondaryColor} radius={[4, 4, 0, 0]} barSize={10} /> {/* Thinner bars */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center text-on-surface-variant/70 dark:text-dark-on-surface-variant/70 text-sm px-4">No session data found for the last 30 days.</p>
                </div>
            )}
        </div>
    );
};

export default MonthlyCompletionChart;