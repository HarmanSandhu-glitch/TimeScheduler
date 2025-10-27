import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTask, getTasks, updateTask, deleteTask, reset } from '../../features/taskSlice';

// --- Material You Priority Colors ---
const priorityColors = {
  High: {
    bg: 'bg-error-container dark:bg-dark-error-container',
    text: 'text-on-error-container dark:text-dark-on-error-container',
    indicator: 'bg-error dark:bg-dark-error',
  },
  Medium: {
    // Example using secondary, adjust if needed
    bg: 'bg-secondary-container dark:bg-dark-secondary-container',
    text: 'text-on-secondary-container dark:text-dark-on-secondary-container',
    indicator: 'bg-secondary dark:bg-dark-secondary',
  },
  Low: {
    // Example using tertiary, adjust if needed
    bg: 'bg-tertiary-container dark:bg-dark-tertiary-container',
    text: 'text-on-tertiary-container dark:text-dark-on-tertiary-container',
    indicator: 'bg-tertiary dark:bg-dark-tertiary',
  },
};
// --- End Material You Priority Colors ---

function TaskControl({ tasks = [] }) {
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
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );

   // Handle potential errors (e.g., display a toast notification)
   useEffect(() => {
       if (isError) {
           alert(`Task Error: ${message}`); // Replace with better UI feedback
           dispatch(reset()); // Reset error state after showing
       }
   }, [isError, message, dispatch]);

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
    if (user && !isLoading) {
      dispatch(createTask({ ...taskFormData, userId: user.id })).then(() => {
         // Optionally reset form only on success
         setTaskFormData({ taskName: '', taskDescription: '', taskPriority: 'Medium' });
         setShowCreateForm(false); // Hide form after creation
      });
    }
  };

  const handleEditClick = (task) => {
    setSelectedTaskId(task._id);
    setUpdateFormData({
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      taskPriority: task.taskPriority,
    });
    setShowCreateForm(false); // Hide create form if it was open
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (user && selectedTaskId && !isLoading) {
      dispatch(updateTask({ taskId: selectedTaskId, taskData: updateFormData })).then(() => {
          setSelectedTaskId(''); // Close modal on success
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    // Confirmation dialog
    if (user && !isLoading && window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  // Shared class definitions for consistency
  const inputClasses = "input-base"; // Use component from index.css
  const selectClasses = inputClasses;
  const labelClasses = "label-base"; // Use component from index.css
  const primaryButtonClasses = "button-primary"; // Use component from index.css
  const textButtonClasses = "button-text"; // Use component from index.css


  return (
    <div className="space-y-6">

        {/* Toggle Button for Create Form */}
       {!showCreateForm && !selectedTaskId && (
           <button onClick={() => setShowCreateForm(true)} className={`${primaryButtonClasses} w-auto`}> {/* w-auto */}
               + Add New Task
           </button>
       )}

      {/* Create New Task Form (Conditional) */}
       {showCreateForm && (
           <div className="p-6 border border-outline/20 dark:border-dark-outline/20 rounded-2xl bg-surface dark:bg-dark-surface animate-fade-in"> {/* Simple fade-in animation */}
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-medium text-on-surface dark:text-dark-on-surface">Create New Task</h3>
                  <button onClick={() => setShowCreateForm(false)} className="button-icon text-secondary dark:text-dark-secondary" title="Close">
                      {/* Close Icon (X) */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <form onSubmit={handleCreateTask} className="space-y-4">
               <div>
                   <label htmlFor="taskName" className={labelClasses}>Task Name</label>
                   <input type="text" id="taskName" name="taskName" value={taskFormData.taskName} onChange={onTaskFormChange} placeholder="e.g., Complete project report" required className={inputClasses}/>
               </div>
               <div>
                   <label htmlFor="taskDescription" className={labelClasses}>Description (Optional)</label>
                   <textarea id="taskDescription" name="taskDescription" value={taskFormData.taskDescription} onChange={onTaskFormChange} placeholder="Add more details..." rows="3" className={inputClasses}></textarea>
               </div>
               <div>
                   <label htmlFor="taskPriority" className={labelClasses}>Priority</label>
                   <select id="taskPriority" name="taskPriority" value={taskFormData.taskPriority} onChange={onTaskFormChange} className={selectClasses}>
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                   </select>
               </div>
               <div className="flex justify-end pt-2">
                 <button type="submit" disabled={isLoading} className={`${primaryButtonClasses} w-auto`}> {/* w-auto */}
                    {isLoading ? 'Adding...' : 'Add Task'}
                 </button>
               </div>
               </form>
           </div>
       )}

      {/* Your Tasks List */}
      <div>
        {/* Only show title if there are tasks or not loading */}
        {!isLoading && tasks.length > 0 && (
             <h3 className="text-lg font-medium text-on-surface dark:text-dark-on-surface mb-4">Your Tasks</h3>
        )}

        {isLoading ? (
             <p className="text-center text-secondary dark:text-dark-secondary py-4">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => {
              const colors = priorityColors[task.taskPriority] || priorityColors.Medium;
              return (
              <li key={task._id} className={`flex items-center justify-between p-4 rounded-2xl shadow-sm border border-transparent hover:border-outline/30 dark:hover:border-dark-outline/30 transition-colors duration-200 ${colors.bg}`}>
                <span className={`w-2 h-6 ${colors.indicator} rounded-full mr-4 flex-shrink-0`}></span> {/* Indicator Bar */}
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium ${colors.text} truncate`}>{task.taskName}</p>
                  {task.taskDescription && <p className={`text-sm ${colors.text} opacity-80 mt-0.5 truncate`}>{task.taskDescription}</p>}
                </div>
                <div className="flex space-x-1 flex-shrink-0 ml-2">
                  {/* Edit Button - Icon Style */}
                  <button
                    onClick={() => handleEditClick(task)}
                    className={`button-icon ${colors.text} hover:bg-black/5 dark:hover:bg-white/5`}
                    title="Edit Task"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                  </button>
                   {/* Delete Button - Icon Style (Error Color) */}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                     className={`button-icon text-error dark:text-dark-error hover:bg-error/10 dark:hover:bg-dark-error/10 focus:ring-error dark:focus:ring-dark-error`}
                    title="Delete Task"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L3.772 5.79m14.456 0a48.85 48.85 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
        ) : (
           // Show only if not loading and no tasks exist
           !isLoading && <p className="text-center text-on-surface-variant dark:text-dark-on-surface-variant py-4">No tasks yet. Click "+ Add New Task" to create one!</p>
        )}
      </div>

      {/* Edit Task Modal */}
      {selectedTaskId && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
          <div className="bg-surface dark:bg-dark-surface p-6 rounded-3xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-medium text-on-surface dark:text-dark-on-surface">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label htmlFor="editTaskName" className={labelClasses}>Task Name</label>
                <input type="text" id="editTaskName" name="taskName" value={updateFormData.taskName} onChange={onUpdateFormChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="editTaskDescription" className={labelClasses}>Description</label>
                <textarea id="editTaskDescription" name="taskDescription" value={updateFormData.taskDescription} onChange={onUpdateFormChange} rows="3" className={inputClasses}></textarea>
              </div>
              <div>
                <label htmlFor="editTaskPriority" className={labelClasses}>Priority</label>
                <select id="editTaskPriority" name="taskPriority" value={updateFormData.taskPriority} onChange={onUpdateFormChange} className={selectClasses}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskId('')}
                  className={textButtonClasses} // Use text button
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={primaryButtonClasses} // Use primary button
                  disabled={isLoading}
                >
                   {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskControl;