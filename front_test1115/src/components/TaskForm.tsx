import React, { useState } from 'react'
import '../layouts/Styles/TaskForm.css';

interface TaskFormProps {
  addTask: (task: string) => void;
}

export default function TaskForm({ addTask }: TaskFormProps) {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      addTask(task.trim());
      setTask('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="new-input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit" className="task-submit">
        추가
        <i className="bi bi-plus-square"></i>
      </button>
    </form>
  )
}