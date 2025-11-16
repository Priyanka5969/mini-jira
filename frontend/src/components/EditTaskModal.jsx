import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditTaskModal({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // fetch all users except password
    api.get("/auth/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] shadow-xl animate-fadeIn">

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Task</h2>

        {/* TITLE */}
        <label className="block text-sm text-gray-600">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* DESCRIPTION */}
        <label className="block text-sm text-gray-600">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3 h-24"
        />

        {/* STATUS */}
        <label className="block text-sm text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="new">New</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* ASSIGN USER */}
        <label className="block text-sm text-gray-600">Assign To</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-black"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({ 
                title, 
                description, 
                status, 
                assignedTo: assignedTo || null 
              })
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
