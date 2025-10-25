import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createDailySessions,
  getSessionsByDate,
  updateSessionStatus,
  updateSessionTask,
  updateSpecialNote,
  reset,
} from '../features/sessionSlice';
import { getTasks } from '../features/taskSlice'; // To get tasks for assigning

function SessionTest() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sessions, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.sessions
  );
  const { tasks } = useSelector((state) => state.tasks); // From taskSlice

  useEffect(() => {
    if (isError) {
      alert(`Session Error: ${message}`);
    }
    if (user) {
      dispatch(getSessionsByDate(selectedDate));
      dispatch(getTasks(user.id)); // Fetch tasks for task assignment dropdown
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, dispatch, selectedDate]);

  const handleCreateDailySessions = () => {
    if (user) {
      dispatch(createDailySessions({ sessionDate: selectedDate }));
    } else {
      alert('Please sign in to create sessions.');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleUpdateStatus = (sessionId, status) => {
    dispatch(updateSessionStatus({ sessionId, status }));
  };

  const handleUpdateTask = (sessionId) => {
    if (selectedTaskId) {
      dispatch(updateSessionTask({ sessionId, taskId: selectedTaskId }));
      setSelectedTaskId('');
    } else {
      alert('Please select a task to assign.');
    }
  };

  const handleUpdateNote = (sessionId) => {
    if (newNote) {
      dispatch(updateSpecialNote({ sessionId, note: newNote }));
      setNewNote('');
    } else {
      alert('Please enter a note.');
    }
  };

  if (isLoading) {
    return <p>Loading sessions...</p>;
  }

  return (
    <div>
      <h2>Session Test</h2>
      {user ? (
        <>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <button onClick={handleCreateDailySessions}>Create Daily Sessions for {selectedDate}</button>
          </div>

          <h3>Sessions for {selectedDate}</h3>
          {sessions.length > 0 ? (
            <ul>
              {sessions.map((session) => (
                <li key={session._id}>
                  {session.sessionStartTime} - {session.sessionEndTime} | Status: {session.sessionStatus}
                  {session.sessionTask && ` | Task: ${session.sessionTask.taskName}`}
                  {session.sessionSpecialNote && ` | Note: ${session.sessionSpecialNote}`}
                  <div>
                    <button onClick={() => handleUpdateStatus(session._id, 'Completed')}>Mark Completed</button>
                    <button onClick={() => handleUpdateStatus(session._id, 'Pending')}>Mark Pending</button>
                    <button onClick={() => setSelectedSessionId(session._id)}>Edit Details</button>
                  </div>

                  {selectedSessionId === session._id && (
                    <div>
                      <h4>Edit Session {session._id.substring(0, 5)}...</h4>
                      <select
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                      >
                        <option value="">-- Select Task --</option>
                        {tasks.map((task) => (
                          <option key={task._id} value={task._id}>
                            {task.taskName}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleUpdateTask(session._id)}>Assign Task</button>
                      <br />
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Special Note"
                      />
                      <button onClick={() => handleUpdateNote(session._id)}>Add Note</button>
                      <button type="button" onClick={() => setSelectedSessionId('')}>Close Edit</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sessions found for this date. Create them!</p>
          )}
        </>
      ) : (
        <p>Please sign in to view and manage sessions.</p>
      )}
    </div>
  );
}

export default SessionTest;
