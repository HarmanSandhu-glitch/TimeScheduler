import React, { useState, useMemo } from 'react'; // Import useState for hover effect
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Text, Sector } from 'recharts'; // Import Sector
import { PRIORITY_COLORS } from '../../constants/app.constants';
import { useSelector } from 'react-redux';

// Define a color palette for tasks + a color for 'Completed'
const TASK_CHART_COLORS_LIGHT = [
  '#6750A4', '#625B71', '#7D5260', '#B3261E', '#006D3D', '#0061A4', '#BC5E00',
  '#4B5EAA', '#A93F55', '#D97C00', '#006A60', '#9A4524',
];
const TASK_CHART_COLORS_DARK = [
  '#D0BCFF', '#CCC2DC', '#EFB8C8', '#F2B8B5', '#79D7A0', '#9BCAFF', '#FFB86F',
  '#B0C6FF', '#FFAFB5', '#FFBB56', '#6DE5D5', '#FFBDA0',
];
const COMPLETED_COLOR_LIGHT = '#E7E0EC';
const COMPLETED_COLOR_DARK = '#49454E';
const COMPLETED_TEXT_COLOR_LIGHT = '#49454E'; // Color for text on completed slice (light)
const COMPLETED_TEXT_COLOR_DARK = '#CAC4D0'; // Color for text on completed slice (dark)


// Active shape component for hover effect
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos; // Move label slightly out on hover
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12; // Line end point
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Center Text (Optional) */}
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14}>
        {payload.name}
      </text> */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 2} // Slightly larger outer radius on hover
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={props.stroke} // Keep stroke
        strokeWidth={props.strokeWidth}
      />
      {/* Connector Line and Label */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill={props.textColor} fontSize={12}>{`${payload.name} (${value})`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={14} textAnchor={textAnchor} fill={props.textColor} fontSize={10}>
        {`(Rate: ${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};


const SessionStatusChart = ({ dailySessions = [], tasks = [] }) => {
  // Use a stable way to detect dark mode from localStorage or system preference
  const [isDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeIndex, setActiveIndex] = useState(null); // State for active segment

  // Memoize colors to prevent recalculation
  const { colorPalette, completedColor, axisTextColor, completedTextColor } = useMemo(() => ({
    colorPalette: isDarkMode ? TASK_CHART_COLORS_DARK : TASK_CHART_COLORS_LIGHT,
    completedColor: isDarkMode ? COMPLETED_COLOR_DARK : COMPLETED_COLOR_LIGHT,
    axisTextColor: isDarkMode ? '#CAC4D0' : '#49454E',
    completedTextColor: isDarkMode ? COMPLETED_TEXT_COLOR_DARK : COMPLETED_TEXT_COLOR_LIGHT,
  }), [isDarkMode]);

  const assignedSessions = dailySessions.filter(session => session.sessionTask);

  const taskStatusCounts = assignedSessions.reduce((acc, session) => {
    const taskId = session.sessionTask?._id || session.sessionTask;
    const task = tasks.find(t => t._id === taskId);
    const taskName = task ? task.taskName : 'Unknown Task';

    if (session.sessionStatus === 'Completed') {
      acc['Completed'] = (acc['Completed'] || 0) + 1;
    } else {
      acc[taskName] = (acc[taskName] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(taskStatusCounts).map(([name, value], index) => {
    const isTask = name !== 'Completed';
    const color = isTask ? colorPalette[index % colorPalette.length] : completedColor;
    // Determine text color for label based on segment color
    const labelTextColor = isTask
      ? (isDarkMode ? "#1C1B1F" : "#FFFFFF") // High contrast for task colors
      : completedTextColor; // Specific color for 'Completed' slice

    return {
      name: name,
      value: value,
      isTask: isTask,
      color: color,
      labelTextColor: labelTextColor,
    };
  }).filter(item => item.value > 0);


  const totalAssignedSessions = assignedSessions.length;

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  }

  // Custom label inside the slice (shows count)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Position label inside
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // Hide label if slice is too small or value is 0
    if (percent < 0.05 || value === 0) return null;

    return (
      <Text
        x={x} y={y}
        fill={payload.labelTextColor} // Use dynamic text color
        textAnchor="middle" dominantBaseline="central"
        fontSize="12px" fontWeight="600" // Bolder font
        // Prevent text selection
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {value}
      </Text>
    );
  };

  // Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalAssignedSessions > 0 ? ((data.value / totalAssignedSessions) * 100).toFixed(1) : 0;
      const label = data.isTask ? `Pending: ${data.name}` : data.name;
      return (
        <div className="bg-inverse-surface dark:bg-dark-inverse-surface text-inverse-on-surface dark:text-dark-inverse-on-surface p-2 rounded-lg shadow-md text-sm border border-outline/20 dark:border-dark-outline/20">
          <p className="font-medium">{`${label}: ${data.value}`}</p>
          <p className="text-xs opacity-80">{`(${percentage}% of assigned)`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <>
      <h3 className="text-lg font-medium text-on-secondary-container dark:text-dark-on-secondary-container mb-4 text-center">
        Today's Assigned Session Status
      </h3>
      {totalAssignedSessions > 0 ? (
        // Increased height for better legend visibility
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={(props) => <renderActiveShape {...props} textColor={axisTextColor} />} // Pass axis text color
              data={chartData}
              cx="50%" cy="50%"
              labelLine={false} label={renderCustomizedLabel}
              outerRadius={85} innerRadius={55} // Slightly larger inner radius
              fill="#8884d8" dataKey="value"
              stroke={isDarkMode ? "#4A4458" : "#E8DEF8"}
              strokeWidth={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave} // Add leave event
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Tooltip hidden if activeIndex is set (activeShape shows info) */}
            {activeIndex === null && <Tooltip content={<CustomTooltip />} />}
            <Legend
              iconType="circle"
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              // Allow legend items to wrap
              wrapperStyle={{ fontSize: "12px", paddingTop: "20px", lineHeight: "1.6", whiteSpace: 'normal' }}
              formatter={(value, entry) => (
                <span className="text-on-secondary-container/90 dark:text-dark-on-secondary-container/90 ml-1.5 mr-3 truncate inline-block" title={value} style={{ maxWidth: '120px' }}> {/* Allow truncation */}
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-on-secondary-container/70 dark:text-dark-on-secondary-container/70 mt-10">No sessions assigned to tasks for today.</p>
      )}
    </>
  );
};

export default SessionStatusChart;