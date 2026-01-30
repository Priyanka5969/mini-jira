import { useDispatch } from "react-redux";
import { deleteTask } from "../features/tasks/tasksSlice.js";

export default function TaskCard({ task, onStatusChange, onEdit }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      dispatch(deleteTask(task._id));
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 relative">

      {/* Edit button */}
      <button
        onClick={() => onEdit(task)}
        className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
      >
        ✎
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="font-semibold">{task.title}</h3>

      {/* Status buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["new", "inprogress", "completed"].map((s) =>
          s !== task.status ? (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className="px-2 py-1 border rounded text-xs sm:text-sm hover:bg-gray-100 capitalize"
            >
              {s}
            </button>
          ) : null
        )}
      </div>

    </div>
  );
}
