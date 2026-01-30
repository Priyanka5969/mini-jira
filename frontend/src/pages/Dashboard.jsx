import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import { 
  fetchTasks, 
  createTask, 
  updateTask,
  fetchStats,
  fetchLast7Days
} from "../features/tasks/tasksSlice";
import useDebounce from "../hooks/useDebounce";

export default function Dashboard() {
  const dispatch = useDispatch();

  const tasks = useSelector((s) => s.tasks.items);
  const stats = useSelector((s) => s.tasks.stats);
  const last7days = useSelector((s) => s.tasks.last7days);

  const [editTask, setEditTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search);

  // Fetch tasks on search or initial load
  useEffect(() => {
    dispatch(fetchTasks(debounced));
  }, [debounced, dispatch]);

  // Calculate stats locally from tasks (no API call needed)
  const localStats = {
    new: tasks.filter(t => t.status === "new").length,
    inprogress: tasks.filter(t => t.status === "inprogress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  // Only fetch analytics on initial load or when explicitly needed
  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchStats());
      dispatch(fetchLast7Days());
    }
  }, []);

  // --------------------------
  // CHANGE STATUS
  // --------------------------
  const changeStatus = (id, status) => {
    // Optimistic update - update immediately without waiting for API
    dispatch(updateTask({ id, data: { status } }));
    // No need to refetch - Redux already updates the task in state
  };

  return (
    <>
      <Navbar />

      <div className="p-4 md:p-6">
        {/* SEARCH + ADD BUTTON */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <input
            placeholder="Search tasks..."
            className="border p-2 rounded w-full sm:w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded whitespace-nowrap"
          >
            + Add Task
          </button>
        </div>

        {/* EDIT MODAL */}
        {editTask && (
          <EditTaskModal
            task={editTask}
            onClose={() => setEditTask(null)}
            onSubmit={(data) => {
              dispatch(updateTask({ id: editTask._id, data }));
              setEditTask(null);
              // No need to refetch - Redux updates the task automatically
            }}
          />
        )}

        {/* ANALYTICS */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">New</p>
            <p className="text-2xl font-semibold">{localStats.new}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-semibold">{localStats.inprogress}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-semibold">{localStats.completed}</p>
          </div>
        </div>

        {/* TASK COLUMNS */}
        <div className="flex flex-col lg:flex-row gap-4">
          <Column
            title="New"
            tasks={tasks.filter((t) => t.status === "new")}
            onStatusChange={changeStatus}
            onEdit={(task) => setEditTask(task)}
          />

          <Column
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "inprogress")}
            onStatusChange={changeStatus}
            onEdit={(task) => setEditTask(task)}
          />

          <Column
            title="Completed"
            tasks={tasks.filter((t) => t.status === "completed")}
            onStatusChange={changeStatus}
            onEdit={(task) => setEditTask(task)}
          />
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {modalOpen && (
        <AddTaskModal
          onClose={() => setModalOpen(false)}
          onSubmit={(data) => {
            dispatch(createTask(data));
            // No need to refetch - Redux adds the task automatically
          }}
        />
      )}
    </>
  );
}
