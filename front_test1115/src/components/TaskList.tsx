import React from "react";
import '../layouts/Styles/TaskList.css';
import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  updateTask : (task : Task) => void;
  toggleTaskStatus: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

export default function TaskList({
  tasks,
  updateTask,
  toggleTaskStatus,
  deleteTask,
}: TaskListProps) {
  return (
    <ul className="to-do-list">
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`task ${task.status ? "completed" : ""}`}
          onClick={() => toggleTaskStatus(task)}
        >
          <span>{task.task}</span>
          <div>
          <button onClick={e => {
            e.stopPropagation();
            updateTask(task)
          }} className="bi bi-x-square update-btn">
            수정
          </button>
          <button
            className="bi bi-x-square delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task);
            }}
          >X</button>
          </div>
        </li>
      ))}
    </ul>
  );
}