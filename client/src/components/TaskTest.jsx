import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTask, getTasks, updateTask, deleteTask, reset } from '../features/taskSlice';

function TaskTest() {
  const [taskFormData, setTaskFormData] = useState({
    taskName: '',
    taskDescription: '',
    taskPriority: 'Medium',
  });
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [updateFormData, setUpdateFormData] = useState({
    taskName: '',
    taskDescription: '',
    taskPriority: 'Medium',
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    if (isError) {
      alert(`Task Error: ${message}`);
    }
    if (user) {
      dispatch(getTasks(user.id));
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, dispatch]);

  const onTaskFormChange = (e) => {
    setTaskFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onUpdateFormChange = (e) => {
    setUpdateFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (user) {
      dispatch(createTask({ ...taskFormData, userId: user.id }));
      setTaskFormData({ taskName: '', taskDescription: '', taskPriority: 'Medium' });
    } else {
      alert('Please sign in to create tasks.');
    }
  };

  const handleEditClick = (task) => {
    setSelectedTaskId(task._id);
    setUpdateFormData({
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      taskPriority: task.taskPriority,
    });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (user && selectedTaskId) {
      dispatch(updateTask({ taskId: selectedTaskId, taskData: updateFormData }));
      setSelectedTaskId('');
      setUpdateFormData({ taskName: '', taskDescription: '', taskPriority: 'Medium' });
    }
  };

  const handleDeleteTask = (taskId) => {
    if (user && window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <h2>Task Test</h2>
      {user ? (
        <>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              name="taskName"
              value={taskFormData.taskName}
              onChange={onTaskFormChange}
              placeholder="Task Name"
              required
            />
            <input
              type="text"
              name="taskDescription"
              value={taskFormData.taskDescription}
              onChange={onTaskFormChange}
              placeholder="Description"
            />
            <select name="taskPriority" value={taskFormData.taskPriority} onChange={onTaskFormChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit">Add Task</button>
          </form>

          <h3>Your Tasks</h3>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task._id}>
                  {task.taskName} ({task.taskPriority})
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  {selectedTaskId === task._id && (
                    <form onSubmit={handleUpdateTask}>
                      <input
                        type="text"
                        name="taskName"
                        value={updateFormData.taskName}
                        onChange={onUpdateFormChange}
                      />
                      <input
                        type="text"
                        name="taskDescription"
                        value={updateFormData.taskDescription}
                        onChange={onUpdateFormChange}
                      />
                      <select name="taskPriority" value={updateFormData.taskPriority} onChange={onUpdateFormChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <button type="submit">Save Changes</button>
                      <button type="button" onClick={() => setSelectedTaskId('')}>Cancel</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found. Create one!</p>
          )}
        </>
      ) : (
        <p>Please sign in to view and manage tasks.</p>
      )}
    </div>
  );
}

export default TaskTest;
