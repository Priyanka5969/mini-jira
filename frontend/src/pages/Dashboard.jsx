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

  // Fetch tasks on search
  useEffect(() => {
    dispatch(fetchTasks(debounced));
  }, [debounced, dispatch]);

  // Update analytics whenever tasks change
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchLast7Days());
  }, [tasks, dispatch]);


  // --------------------------
  // CHANGE STATUS
  // --------------------------
  const changeStatus = (id, status) => {
    dispatch(updateTask({ id, data: { status } }))
      .then(() => {
        dispatch(fetchTasks());
        dispatch(fetchStats());
      });
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
              dispatch(updateTask({ id: editTask._id, data }))
                .then(() => {
                  dispatch(fetchTasks());
                  dispatch(fetchStats());
                });

              setEditTask(null);
            }}
          />
        )}

        {/* ANALYTICS */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">New</p>
            <p className="text-2xl font-semibold">{stats.new || 0}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-semibold">{stats.inprogress || 0}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-semibold">{stats.completed || 0}</p>
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
          onSubmit={(data) =>
            dispatch(createTask(data)).then(() => {
              dispatch(fetchTasks());
              dispatch(fetchStats());
            })
          }
        />
      )}
    </>
  );
}
