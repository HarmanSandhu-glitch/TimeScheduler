import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';

// --- Material You Colors for Assignment Status ---
const ASSIGNMENT_COLORS = {
    // Using theme colors (adjust as needed)
    'Assigned': '#7D5260', // Tertiary
    'Unassigned': '#E7E0EC', // Surface Variant (for less emphasis)
    // Dark mode equivalents
    'dark-Assigned': '#EFB8C8',
    'dark-Unassigned': '#49454E',
};
// --- End Assignment Colors ---

const SessionAssignmentChart = ({ dailySessions = [] }) => {
    const isDarkMode = document.documentElement.classList.contains('dark');

    const assignmentCounts = dailySessions.reduce((acc, session) => {
        // Check if sessionTask exists and is not null/undefined
        if (session.sessionTask) {
            acc['Assigned'] = (acc['Assigned'] || 0) + 1;
        } else {
            acc['Unassigned'] = (acc['Unassigned'] || 0) + 1;
        }
        return acc;
    }, {});

    const data = [
        { name: 'Assigned', value: assignmentCounts['Assigned'] || 0, key: 'Assigned' },
        { name: 'Unassigned', value: assignmentCounts['Unassigned'] || 0, key: 'Unassigned' },
    ].filter(item => item.value > 0);

    const totalSessions = dailySessions.length;

    // Custom label inside the slice
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent < 0.05) return null;
        return (
            <Text
                x={x} y={y}
                // Use on-container colors or high contrast
                fill={isDarkMode ? "#1C1B1F" : "#FFFFFF"}
                textAnchor="middle" dominantBaseline="central"
                fontSize="12px" fontWeight="500"
            >
                {value}
            </Text>
        );
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = totalSessions > 0 ? ((data.value / totalSessions) * 100).toFixed(1) : 0;
            return (
                <div className="bg-inverse-surface dark:bg-dark-inverse-surface text-inverse-on-surface dark:text-dark-inverse-on-surface p-2 rounded-lg shadow-md text-sm border border-outline/20 dark:border-dark-outline/20">
                    <p className="font-medium">{`${data.name}: ${data.value}`}</p>
                    <p className="text-xs opacity-80">{`(${percentage}%)`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <h3 className="text-lg font-medium text-on-tertiary-container dark:text-dark-on-tertiary-container mb-4 text-center">
                Today's Session Assignment
            </h3>
            {totalSessions > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" cy="50%"
                            labelLine={false} label={renderCustomizedLabel}
                            outerRadius={85} innerRadius={50}
                            fill="#8884d8" dataKey="value"
                            stroke={isDarkMode ? "#633B48" : "#FFD8E4"} // Match container bg
                            strokeWidth={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ASSIGNMENT_COLORS[isDarkMode ? `dark-${entry.key}` : entry.key] || '#79747E'} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
                            formatter={(value, entry) => (
                                <span className="text-on-tertiary-container/80 dark:text-dark-on-tertiary-container/80 ml-1.5">{value} ({entry.payload.value})</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-on-tertiary-container/70 dark:text-dark-on-tertiary-container/70 mt-10">No sessions found for today.</p>
            )}
        </>
    );
};

export default SessionAssignmentChart;